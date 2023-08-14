import {
    ApertureIcon,
    CopyIcon,
    LayoutDashboardIcon
} from 'vue-tabler-icons';

export interface menu {
    header?: string;
    title?: string;
    icon?: any;
    to?: string;
    chip?: string;
    chipColor?: string;
    chipVariant?: string;
    chipIcon?: string;
    children?: menu[];
    disabled?: boolean;
    type?: string;
    subCaption?: string;
}

const sidebarItem: menu[] = [
    { header: 'Home' },
    {
        title: 'Stories',
        icon: LayoutDashboardIcon,
        to: '/'
    },
];

export default sidebarItem;
