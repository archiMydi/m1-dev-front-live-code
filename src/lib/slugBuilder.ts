export function buildBPartsSlug(vehicleData: any): string {
	if (!vehicleData?.all?.[0]) return "";

	const v = vehicleData.all[0];

	const brand = v.brand?.label || "";

	const rawModel =
		v.attributes?.find((a: any) => a.type === "LIBMODSPE")?.value || v.model?.label || "";

	// Le moteur (ex: "2.0 TFSI quattro")
	const engine = v.cyl?.label || "";

	// La puissance (PUIMOTCVX = Puissance Moteur Chevaux)
	const hp = v.attributes?.find((a: any) => a.type === "PUIMOTCVX")?.value || "0";

	// Le K-Type
	const ktype = v.idsOther?.find((a: any) => a.name === "KTYPE")?.value || "0";

	// On concatène tout : "AUDI A4 B7 (8EC) 2.0 TFSI quattro 200 hp 18372 vv"
	const rawString = `${brand} ${rawModel} ${engine} ${hp} hp ${ktype} vv`;

	// Fonction de nettoyage
	return rawString
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "") // Enlève les accents (é -> e)
		.replace(/\./g, "-") // Remplace les points par des tirets (1.4 -> 1-4)
		.replace(/[(),]/g, "") // Enlève parenthèses et virgules
		.replace(/[^a-z0-9]+/g, "-") // Remplace tout ce qui n'est pas alphanum par un tiret
		.replace(/^-+|-+$/g, ""); // Enlève les tirets au début et à la fin
}
