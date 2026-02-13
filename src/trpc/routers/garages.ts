import z from "zod";
import { authedProcedure, publicProcedure, router } from "../init";
import { db, s } from "@/db";
import { takeFirst, takeFirstOrThrow } from "@/db/utils";
import { eq, or, and, exists, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";

const INVITE_EXPIRATION_TIME = 1 * 24 * 60 * 60 * 1000; // 1 day in milliseconds

export const garagesRouter = router({
	create: authedProcedure
		.input(
			z.object({
				name: z.string(),
				address: z.string(),
				phone: z.string(),
				email: z.email(),
				codeComptable: z.string(),
				formeJuridique: z.string().nullish(),
				siret: z.string(),
				ape: z.string().nullish(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const garage = await db
				.insert(s.garage)
				.values({
					name: input.name,
					address: input.address,
					phone: input.phone,
					email: input.email,
					codeComptable: input.codeComptable,
					formeJuridique: input.formeJuridique ?? undefined,
					siret: input.siret,
					ape: input.ape ?? undefined,
					ownerId: ctx.user.id,
				})
				.returning()
				.then(takeFirstOrThrow);

			// Add the owner as a member of the garage
			await db.insert(s.garageMember).values({
				garageId: garage.id,
				userId: ctx.user.id,
				role: "owner",
			});

			return garage;
		}),
	get: publicProcedure
		.input(
			z.object({
				id: z.union([z.string(), z.number()]),
			}),
		)
		.query(async ({ input, ctx }) => {
			const garageId = typeof input.id === "string" ? parseInt(input.id, 10) : input.id;

			const garage = await db
				.select()
				.from(s.garage)
				.where(eq(s.garage.id, garageId))
				.then(takeFirst);

			if (!garage) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Garage not found.",
				});
			}

			return garage;
		}),
	listMine: authedProcedure.query(async ({ ctx }) => {
		const garages = await db
			.select({
				id: s.garage.id,
				name: s.garage.name,
				address: s.garage.address,
				memberCount: db.$count(s.garageMember, eq(s.garageMember.garageId, s.garage.id)),
			})
			.from(s.garage)
			.where(
				or(
					eq(s.garage.ownerId, ctx.user.id),
					exists(
						db
							.select()
							.from(s.garageMember)
							.where(
								and(
									eq(s.garageMember.garageId, s.garage.id),
									eq(s.garageMember.userId, ctx.user.id),
								),
							),
					),
				),
			);

		return garages;
	}),
	createInvite: authedProcedure
		.input(
			z.object({
				garageId: z.union([z.string(), z.number()]),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const garageId =
				typeof input.garageId === "string" ? parseInt(input.garageId, 10) : input.garageId;

			// Check if the user is the owner of the garage
			const isOwner = db
				.select({
					_: sql`1`,
				})
				.from(s.garage)
				.where(and(eq(s.garage.id, garageId), eq(s.garage.ownerId, ctx.user.id)))
				.then(takeFirst)
				.then((result) => result != null);

			if (!isOwner) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "You are not the owner of this garage.",
				});
			}

			// Generate a random invite code
			const inviteCode = crypto.randomBytes(16).toString("hex");

			// Store the invite code in the database
			await db.insert(s.garageInvite).values({
				code: inviteCode,
				garageId,
				expiresAt: new Date(Date.now() + INVITE_EXPIRATION_TIME),
			});

			return { inviteCode };
		}),
	joinWithInvite: authedProcedure
		.input(
			z.object({
				inviteCode: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			// Find the invite by code
			const invite = await db
				.select()
				.from(s.garageInvite)
				.where(eq(s.garageInvite.code, input.inviteCode))
				.then(takeFirst);

			let hasExpired = false;
			if (invite == null || (hasExpired = invite.expiresAt < new Date())) {
				if (invite != null && hasExpired) {
					// Delete the expired invite
					await db.delete(s.garageInvite).where(eq(s.garageInvite.code, invite.code));
				}

				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Invalid invite code or invite code has expired.",
				});
			}

			// Check if the user is already a member of the garage
			const isMember = await db
				.select()
				.from(s.garageMember)
				.where(
					and(
						eq(s.garageMember.garageId, invite.garageId),
						eq(s.garageMember.userId, ctx.user.id),
					),
				)
				.then(takeFirst)
				.then((result) => result != null);

			if (isMember) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "You are already a member of this garage.",
				});
			}

			// Add the user as a member of the garage
			await db.insert(s.garageMember).values({
				garageId: invite.garageId,
				userId: ctx.user.id,
				role: "member",
			});

			// Delete the invite after use
			await db.delete(s.garageInvite).where(eq(s.garageInvite.code, invite.code));

			return { success: true };
		}),
	quitGarage: authedProcedure
		.input(
			z.object({
				garageId: z.union([z.string(), z.number()]),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const garageId =
				typeof input.garageId === "string" ? parseInt(input.garageId, 10) : input.garageId;

			// Check if the user is a member of the garage (but not the owner)
			const isMember = await db
				.select({
					_: sql`1`,
				})
				.from(s.garageMember)
				.where(
					and(
						eq(s.garageMember.garageId, garageId),
						eq(s.garageMember.userId, ctx.user.id),
					),
				)
				.then(takeFirst)
				.then((result) => result != null);

			if (!isMember) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "You are not a member of this garage.",
				});
			}

			// Remove the user from the garage members
			const result = await db
				.delete(s.garageMember)
				.where(
					and(
						eq(s.garageMember.garageId, garageId),
						eq(s.garageMember.userId, ctx.user.id),
					),
				);

			if (result.rowsAffected === 0) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to quit the garage.",
				});
			}

			return { success: true };
		}),
	members: publicProcedure
		.input(
			z.object({
				garageId: z.union([z.string(), z.number()]),
			}),
		)
		.query(async ({ input }) => {
			const garageId =
				typeof input.garageId === "string" ? parseInt(input.garageId, 10) : input.garageId;

			const members = await db
				.select({
					id: s.user.id,
					name: s.user.name,
					email: s.user.email,
					role: s.garageMember.role,
					joinedAt: s.garageMember.createdAt,
				})
				.from(s.garageMember)
				.innerJoin(s.user, eq(s.user.id, s.garageMember.userId))
				.where(eq(s.garageMember.garageId, garageId));

			return members;
		}),
	kickMember: authedProcedure
		.input(
			z.object({
				garageId: z.union([z.string(), z.number()]),
				userId: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const garageId =
				typeof input.garageId === "string" ? parseInt(input.garageId, 10) : input.garageId;

			// Check if the user is the owner of the garage
			const isOwner = await db
				.select({
					_: sql`1`,
				})
				.from(s.garage)
				.where(and(eq(s.garage.id, garageId), eq(s.garage.ownerId, ctx.user.id)))
				.then(takeFirst)
				.then((result) => result != null);

			if (!isOwner) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "You are not the owner of this garage.",
				});
			}

			// Check if the user to be kicked is a member of the garage
			const isMember = await db
				.select({
					_: sql`1`,
				})
				.from(s.garageMember)
				.where(
					and(
						eq(s.garageMember.garageId, garageId),
						eq(s.garageMember.userId, input.userId),
					),
				)
				.then(takeFirst)
				.then((result) => result != null);

			if (!isMember) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "The user is not a member of this garage.",
				});
			}

			// Remove the user from the garage members
			const result = await db
				.delete(s.garageMember)
				.where(
					and(
						eq(s.garageMember.garageId, garageId),
						eq(s.garageMember.userId, input.userId),
					),
				);

			if (result.rowsAffected === 0) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to kick the member from the garage.",
				});
			}

			return { success: true };
		}),
	edit: authedProcedure
		.input(
			z.object({
				garageId: z.union([z.string(), z.number()]),
				name: z.string().nullish(),
				address: z.string().nullish(),
				phone: z.string().nullish(),
				email: z.email().nullish(),
				codeComptable: z.string().nullish(),
				formeJuridique: z.string().nullish(),
				siret: z.string().nullish(),
				ape: z.string().nullish(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const garageId =
				typeof input.garageId === "string" ? parseInt(input.garageId, 10) : input.garageId;

			// Check if the user is the owner of the garage
			const isOwner = await db
				.select({
					_: sql`1`,
				})
				.from(s.garage)
				.where(and(eq(s.garage.id, garageId), eq(s.garage.ownerId, ctx.user.id)))
				.then(takeFirst)
				.then((result) => result != null);

			if (!isOwner) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "You are not the owner of this garage.",
				});
			}

			// Update the garage details
			const result = await db
				.update(s.garage)
				.set({
					name: input.name ?? undefined,
					address: input.address ?? undefined,
					phone: input.phone ?? undefined,
					email: input.email ?? undefined,
					codeComptable: input.codeComptable ?? undefined,
					formeJuridique: input.formeJuridique, // nullable field, so `null` = clear the field
					siret: input.siret ?? undefined,
					ape: input.ape, // nullable field, so `null` = clear the field
				})
				.where(eq(s.garage.id, garageId));

			if (result.rowsAffected === 0) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update the garage details.",
				});
			}

			return { success: true };
		}),
});
