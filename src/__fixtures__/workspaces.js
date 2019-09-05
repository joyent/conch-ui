const workspaces = [
    {
        "description":"Master workspace",
        "id":"434a98d1-5317-7h64-3b60-12fe533456m5",
        "name":"MASTER",
        "parent_id":null,
        "role":"admin",
    },
    {
        description: "DPC US-WEST-1 Expansion 1",
        id: "as432423-e112-4bg8-6768-ab1ee54a6545",
        name: "us-west-1-exp1",
        parent_id: "434a98d1-5317-7h64-3b60-12fe533456m5",
        role: "admin",
        role_via: "434a98d1-5317-7h64-3b60-12fe533456m5",
    },
    {
        description: "Conch Eng Dev",
        id: "c16we45f-nd43-3yr9-94f1-232e42850odk",
        name: "conch-eng-dev",
        parent_id: "434a98d1-5317-7h64-3b60-12fe533456m5",
        role: "admin",
        role_via: "434a98d1-5317-7h64-3b60-12fe533456m5",
    },
    {
        description: "Conch Dev Staging",
        id: "b835a48d-928s-2j2f-9978-2323e23298a0",
        name: "conch-dev-staging",
        parent_id: "434a98d1-5317-7h64-3b60-12fe533456m5",
        role: "admin",
        role_via: "434a98d1-5317-7h64-3b60-12fe533456m5",
    },
    {
        description: 'Test Workspace',
        id: 'b835a48d-928s-2j2f-9978-2323e23298x9',
        name: 'test-workspace',
        parent_id: '434a98d1-5317-7h64-3b60-12fe533456m5',
        role: 'admin',
        role_via: '434a98d1-5317-7h64-3b60-12fe533456m5',
    },
];

export default workspaces;
