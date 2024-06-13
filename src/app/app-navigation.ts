export const navigation = [
  {
    text: 'DASHBOARD',
    path: '/dashboard',
    icon: 'home',
    levelType: 'doctor'
  },
  {
    text: 'APPOINTMENTS',
    path: '/appointments',
    icon: 'event',
    levelType: 'doctor'
  },
  {
    text: 'MANAGE PROFILE',
    icon: 'group',
    items: [
      {
        text: 'Overview',
        path: '/patient-profile',
      },
      {
        text: 'Guardians',
        path: '/guardians',
      },
      {
        text: 'Social Accounts',
        path: '/social-accounts',
      },
      {
        text: 'Emergency Contacts',
        path: '/emergency-contacts',
      },
    ]
  },

  {
    text: 'MEDICAL HISTORY',
    icon: 'insertrowbelow',
    items: [
      {
        text: 'Past Medications',
        path: '/past-medications',
      },
      {
        text: 'Current Medications',
        path: '/current-medications',
      },
      {
        text: 'Physicians',
        path: '/physicians',
      },
      {
        text: 'Drugs',
        path: '/drugs',
      },
      {
        text: 'Exercise',
        path: '/exercises',
      },
      {
        text: 'Surgical',
        path: '/surguries',
      },
      {
        text: 'Allergies',
        path: '/allergies',
      },
      {
        text: 'Family',
        path: '/families',
      },
      {
        text: 'Hobbies',
        path: '/hobbies',
      }
    ]
  },
  {
    text: 'SOCIAL HISTORY',
    icon: 'insertrowabove',
    items: [
      {
        text: 'Smoking',
        path: '/smoking',
      },
      {
        text: 'Caffeine',
        path: '/caffeine',
      }
    ]
  },
  {
    text: 'CONVERSATIONS',
    path: '/conversations',
    icon: 'message',
    levelType: 'doctor'
  },
  {
    text: 'INSURANCES',
    path: '/insurances',
    icon: 'chart',
    levelType: 'doctor'
  },
  {
    text: 'ATTACHMENTS',
    path: '/attachments',
    icon: 'file',
    levelType: 'doctor'
  },
  {
    text: 'PRESCRIPTIONS',
    path: '/prescriptions',
    icon: 'floppy',
    levelType: 'doctor'
  },
  {
    text: 'PAYMENT DETAILS',
    path: '/invoices',
    icon: 'money',
    levelType: 'doctor'
  },
];
