export const reportedOptions = [
    { label: 'Reported Post', value: 1 },
    { label: 'Reported Comment', value: 2 },
    { label: 'Reported Post and Comment', value: 3 },
    { label : 'None', value : 0}
]

export const classificationsOptions = [
    { label : 'None',value : 'none'},
    { label: 'Deleted', value: 'deleted' },
    { label: 'Deleted(Admin)', value: 'deletedAdmin' },
    { label: 'Recruiting', value: 'recruiting' },
    { label: 'Announcement', value: 'winner' },
    { label: 'Proceeding', value: 'proceeding' },
    { label: 'Closed', value: 'closed' },
    { label: 'Cancelled', value: 'cancelled' }

]

export const postTypeOptions = [
    { label: 'Standard', value: 'standard' },
    { label: 'Recruit', value: 'recruit' },
    { label: 'Raffle', value: 'raffle' },
    { label : 'Poll',value : 'poll'}
]

export const classificationsTypeOptions = {
  standard: [
    { label: 'Deleted', value: 'deleted' },
    { label: 'Deleted(Admin)', value: 'deletedAdmin' }
  ],
  recruit: [
    { label: 'Deleted', value: 'deleted' },
    { label: 'Deleted(Admin)', value: 'deletedAdmin' },
    { label: 'Recruiting', value: 'recruiting' },
    { label: 'Closed', value: 'closed' },
    { label: 'Cancelled', value: 'cancelled' }
  ],
  raffle: [
    { label: 'Deleted', value: 'deleted' },
    { label: 'Deleted(Admin)', value: 'deletedAdmin' },
    { label: 'Recruiting', value: 'recruiting' },
    { label: 'Announcement', value: 'winner' },
    { label: 'Closed', value: 'closed' },
    { label: 'Cancelled', value: 'cancelled' }
  ],
  poll: [
    { label: 'Deleted', value: 'deleted' },
    { label: 'Deleted(Admin)', value: 'deletedAdmin' },
    { label: 'Proceeding', value: 'proceeding' },
    { label: 'Closed', value: 'closed' }
  ],
};

export const paginationItemPerPageOptions = [
    { label: '5', value: 5},
    { label: '10', value: 10 },
    { label: '25', value: 25 },
    { label : '50',value : 50}
]
