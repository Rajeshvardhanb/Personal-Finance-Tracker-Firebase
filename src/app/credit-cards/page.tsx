"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useFinances } from "@/hooks/use-finances";
import { Card, CardContent } from "@/components/ui/card";
import CreditCardsTable from "@/components/credit-cards/CreditCardsTable";
import CreditCardForm from "@/components/credit-cards/CreditCardForm";
import type { CreditCard } from "@/lib/types";

export default function CreditCardsPage() {
  const { data, selectedDate, addCreditCard, updateCreditCard, deleteCreditCard } = useFinances();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);


  const handleAddCard = () => {
    setEditingCard(null);
    setIsFormOpen(true);
  }

  const handleEditCard = (card: CreditCard) => {
    setEditingCard(card);
    setIsFormOpen(true);
  };

  const handleDeleteCard = (id: string) => {
    deleteCreditCard(id);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCard(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Credit Cards">
        <Button onClick={handleAddCard}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Card
        </Button>
      </PageHeader>
      <Card>
        <CardContent className="p-0">
          <CreditCardsTable 
            cards={data.creditCards}
            onEdit={handleEditCard}
            onDelete={handleDeleteCard}
            selectedDate={selectedDate}
          />
        </CardContent>
      </Card>

      {isFormOpen && (
        <CreditCardForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          card={editingCard}
          addCreditCard={addCreditCard}
          updateCreditCard={updateCreditCard}
        />
      )}
    </div>
  );
}
