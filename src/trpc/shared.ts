import * as devalue from "devalue";

export const transformer = {
	serialize: (data: unknown) => {
		return devalue.stringify(data);
	},
	deserialize: (data: string) => {
		return devalue.parse(data);
	},
};
