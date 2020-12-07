export const builds = [
  {
    id: 'b2496b9b-8ss0-4165-be49-a05cafg8h91a',
    description: 'US-West-1 DC',
    name: 'US-West-1',
    created: '2019-11-01 10:15:37.74322-07',
    started: '',
    completed: '',
    completed_user_id: '',
  },
  {
    id: 'b2496b9b-7dd9-4165-be49-a05cafg8h91p',
    description: 'Refreshing the US-EAST-1 DC',
    name: 'US-EAST-1 Refresh',
    created: '2019-11-01 12:15:37.74322-07',
    started: '2019-11-01 12:15:37.74322-07',
    completed: '',
    completed_user_id: '',
  },
  {
    id: 'b2356b9b-7dd9-9487-be11-a50cafg8h91p',
    description: 'First DC on the moon',
    name: 'Moonbase-1',
    created: '2019-09-01 12:13:37.74322-07',
    started: '2019-09-01 12:13:37.74322-07',
    completed: '2019-11-01 12:13:37.74322-07',
    completed_user_id: '4ab5c040-91de-2231-9b9f-393837g4hi30',
  },
];

export const buildOrganizations = [
  {
    admins: [
      {
        email: 'admin@joyent.com',
        id: '47b246c8-9732-489a-a227-23eb2f6770a5',
        name: 'admin',
      },
    ],
    description: 'Engineers focusing on infrastructure development',
    id: 'asdf3ba1-8jks-642f-3432-928av8gg5cd9',
    name: 'Infrastructure Engineering',
    role: 'ro',
  },
  {
    admins: [
      {
        email: 'admin@joyent.com',
        id: '47b246c8-9732-489a-a227-23eb2f6770a5',
        name: 'admin',
      },
    ],
    description: 'Engineers focusing on network development',
    id: 'asdf3ba1-8jks-642f-3432-928av8gg5cd4',
    name: 'Network Engineering',
    role: 'admin',
  },
];

export default { builds, buildOrganizations };
