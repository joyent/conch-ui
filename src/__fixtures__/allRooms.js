const allRooms = [
    {
        name: "eu-east-1a",
        progress: "failing",
        racks: [
            {
                device_progress: {
                    VALID: 18,
                },
                id: "e3e7c2c0-7b4d-4q9a-b865-2y678976543a",
                name: "D.04",
                role: "MANTA",
                size: 45,
            },
        ],
    },
    {
        name: "eu-east-1b",
        progress: "failing",
        racks: [
            {
                device_progress: {
                    VALID: 13,
                },
                id: "e3e7c2c0-7b4d-4q9a-b865-2y678976543a",
                name: "0106",
                role: "MANTA",
                size: 45,
            },
        ],
    },
    {
        name: "eu-east-2c",
        progress: "failing",
        racks: [
            {
                device_progress: {
                    UNKNOWN: 12,
                },
                id: "e3e7c2c0-7b4d-4q9a-b865-2y678976543a",
                name: "D.08",
                role: "TRITON",
                size: 45,
            },
        ],
    },
];

export default allRooms;
