export const users = [
    {
        created: '2018-12-04T12:31:23.489677-08:00',
        email: 'user.name@joyent.com',
        force_password_change: true,
        id: '345a1234-9873-23ks-9983-221b8273629a',
        is_admin: false,
        last_login: '2019-01-23T15:59:59.041066-08:00',
        name: 'User Name',
        refuse_session_auth: true,
        workspaces: [
            {
                description: 'Master workspace',
                id: '434a98d1-5317-7h64-3b60-12fe533456m5',
                name: 'MASTER',
                parent_id: null,
                role: 'admin',
            },
        ],
    },
    {
        created: '2018-12-04T12:31:23.489677-08:00',
        email: 'another.user@joyent.com',
        force_password_change: false,
        id: '345a1234-9873-23ks-9983-221b8273629b',
        is_admin: true,
        last_login: null,
        name: 'Another User',
        refuse_session_auth: false,
        workspaces: [
            {
                description: 'Master workspace',
                id: '434a98d1-5317-7h64-3b60-12fe533456m5',
                name: 'MASTER',
                parent_id: null,
                role: 'admin',
            },
        ],
    },
];

export default users;
