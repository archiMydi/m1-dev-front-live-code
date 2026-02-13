export function takeFirst<T>(records: T[]): T | undefined {
	if (records.length > 0) return records[0];
}

export function takeFirstOrThrow<T>(
	records: T[],
	err: string | (() => Error) = "expected at least one record",
): T {
	if (records.length > 0) return records[0];
	throw typeof err === "function" ? err() : new Error(err);
}
