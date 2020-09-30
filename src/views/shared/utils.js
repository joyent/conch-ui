import { getWorkspaces } from '@api/workspaces.js';
import store from '@src/store/store.js';

export const setGlobalWorkspaceId = () => {
    return getWorkspaces().then(response => {
        const globalWorkspaceId = response.data.find(
            workspace => workspace.name === 'GLOBAL'
        ).id;

        store.dispatch('setGlobalWorkspaceId', globalWorkspaceId);
    });
};

export default { setGlobalWorkspaceId };
