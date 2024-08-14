export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

export interface GroupedPermission {
  name: string;
  actions: {
    read: boolean;
    write: boolean;
    delete: boolean;
  };
}
