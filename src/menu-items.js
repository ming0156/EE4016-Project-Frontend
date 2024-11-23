import {
    Home,
    ManageSearch,
} from '@mui/icons-material';

const icons = {
    home: Home,
    record: ManageSearch,
};

export default [
    {
        id: 'navigation',
        type: 'group',
        children: [
            {
                id: 'home',
                title: 'Member.Title',
                type: 'item',
                icon: icons['home'],
                url: '/home',
            },
            {
                id: 'record',
                title: 'Gift.Title',
                type: 'item',
                icon: icons['record'],
                url: '/record',
            },
        ],
    },
];
