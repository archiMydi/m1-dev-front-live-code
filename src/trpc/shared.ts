import * as devalue from "devalue";

export const transformer = {
	serialize: (data: unknown) => {
		return devalue.stringify(data);
	},
	deserialize: (data: string) => {
		return devalue.parse(data);
	},
	// serialize: (d: any) => d,
	// deserialize: (d: any) => d,
};

export const serverTransformer = transformer;

export const clientTransformer = transformer;
