const validations = [
  {
    created: '2018-03-27T14:36:37.215741-07:00',
    deactivated: '2018-03-27T14:36:37.257972-07:00',
    description: 'Validate expected number of reported USB HDDs',
    id: '83749483-111a-2345-1cd1-2928326a12df',
    name: 'usb_hdd_num',
    updated: '2018-03-27T14:36:37.215741-07:00',
    version: 1,
  },
  {
    created: '2018-03-27T14:36:37.251940-07:00',
    deactivated: null,
    description:
      'Validate the number of peer switches, the number of peer ports, and the\nexpected peer port according to the rack layout',
    id: '83749483-111a-2345-1cd1-2928326a12df',
    name: 'switch_peers',
    updated: '2018-03-27T14:36:37.251940-07:00',
    version: 1,
  },
  {
    created: '2018-03-27T14:36:37.254199-07:00',
    deactivated: null,
    description: "Validate that all non-USB disks report 'OK' SMART status",
    id: '83749483-111a-2345-1cd1-2928326a12df',
    name: 'disk_smart_status',
    updated: '2018-03-27T14:36:37.254199-07:00',
    version: 1,
  },
  {
    created: '2018-03-27T14:36:37.256162-07:00',
    deactivated: null,
    description: 'Validate expected number of SAS HDDs',
    id: '83749483-111a-2345-1cd1-2928326a12df',
    name: 'sas_hdd_num',
    updated: '2018-03-27T14:36:37.256162-07:00',
    version: 1,
  },
];

export default validations;
