"use client";

import { useState } from "react";
import { useFinances } from "@/hooks/use-finances";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import NetWorthSummary from "./NetWorthSummary";
import NetWorthChart from "./NetWorthChart";
import AssetsTable from "./AssetsTable";
import LiabilitiesTable from "./LiabilitiesTable";
import EntryForm from "./EntryForm";
import type { Asset, Liability } from "@/lib/types";

type ModalState = {
  isOpen: boolean;
  entryType: 'asset' | 'liability' | null;
  entry: Asset | Liability | null;
}

export default function NetWorthClient() {
  const { data, addAsset, updateAsset, deleteAsset, addLiability, updateLiability, deleteLiability } = useFinances();
  const [modalState, setModalState] = useState<ModalState>({ isOpen: false, entryType: null, entry: null });

  const totalAssets = data.assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalLiabilities = data.liabilities.reduce((sum, liability) => sum + liability.value, 0);
  const netWorth = totalAssets - totalLiabilities;

  const handleOpenForm = (entryType: 'asset' | 'liability', entry: Asset | Liability | null = null) => {
    setModalState({ isOpen: true, entryType, entry });
  };

  const handleCloseForm = () => {
    setModalState({ isOpen: false, entryType: null, entry: null });
  };

  const handleDelete = (entryType: 'asset' | 'liability', id: string) => {
    if (entryType === 'asset') {
      deleteAsset(id);
    } else {
      deleteLiability(id);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Net Worth">
        <Button onClick={() => handleOpenForm('asset')}>
          <PlusCircle />
          Add Asset
        </Button>
        <Button onClick={() => handleOpenForm('liability')} variant="secondary">
          <PlusCircle />
          Add Liability
        </Button>
      </PageHeader>
      
      <NetWorthSummary assets={totalAssets} liabilities={totalLiabilities} netWorth={netWorth} />

      <NetWorthChart history={data.netWorthHistory} />

      <div className="grid gap-6 md:grid-cols-2">
        <AssetsTable assets={data.assets} onEdit={(asset) => handleOpenForm('asset', asset)} onDelete={(id) => handleDelete('asset', id)} />
        <LiabilitiesTable liabilities={data.liabilities} onEdit={(liability) => handleOpenForm('liability', liability)} onDelete={(id) => handleDelete('liability', id)} />
      </div>

      {modalState.isOpen && modalState.entryType && (
        <EntryForm
          isOpen={modalState.isOpen}
          onClose={handleCloseForm}
          entryType={modalState.entryType}
          entry={modalState.entry}
          addAsset={addAsset}
          updateAsset={updateAsset}
          addLiability={addLiability}
          updateLiability={updateLiability}
        />
      )}
    </div>
  );
}
