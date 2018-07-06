// enum
const RackTypes = {
	TRITON_RACK: {
		name: "42U Triton Rack",
		storage: 100,
		amp: 100,
		color: "#58cafa"
	},
	MANTA_RACK: {
		name: "42U Manta Rack",
		storage: 200,
		amp: 50,
		color: "#FF0099"
	},
	GPGPU_RACK: {
		name: "42U GPGPU Rack",
		storage: 50,
		amp: 200,
		color: "#FF0099"
	}
};

Object.freeze(RackTypes);

export { RackTypes };
