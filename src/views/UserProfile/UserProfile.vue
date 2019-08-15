<template>
    <div class="user-profile">
        <PageHeader
            :title="'User Profile'"
            :subtitle="'Update your password and authentication tokens'"
        />
        <div class="tabs is-toggle">
            <ul>
                <li
                    class="tab-settings"
                    :class="{ 'is-active': activeTab === 'settings' }"
                    @click="activeTab = 'settings'"
                >
                    <a>
                        <span>Account Settings</span>
                    </a>
                </li>
                <li
                    class="tab-tokens"
                    :class="{ 'is-active': activeTab === 'tokens' }"
                    @click="activeTab = 'tokens'"
                >
                    <a>
                        <span>Authentication Tokens</span>
                    </a>
                </li>
            </ul>
        </div>
        <AccountSettingsTab v-if="activeTab === 'settings'" />
        <AuthenticationTokensTab v-else-if="activeTab === 'tokens'" />
    </div>
</template>

<script>
import AccountSettingsTab from './AccountSettingsTab.vue';
import AuthenticationTokensTab from './AuthenticationTokensTab.vue';
import PageHeader from '@src/views/components/PageHeader.vue';

export default {
    components: {
        AccountSettingsTab,
        AuthenticationTokensTab,
        PageHeader,
    },
    data() {
        return {
            activeTab: 'settings',
        };
    },
};
</script>
