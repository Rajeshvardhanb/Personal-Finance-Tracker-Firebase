
'use client';

import PageHeader from "@/components/PageHeader";
import ExpenseCategoryManager from "@/components/settings/ExpenseCategoryManager";

export default function SettingsPage() {

    return (
        <div className="space-y-6">
            <PageHeader title="Settings" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ExpenseCategoryManager />
            </div>
        </div>
    )
}
