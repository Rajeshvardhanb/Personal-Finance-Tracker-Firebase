"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useFinances } from "@/hooks/use-finances";
import CreditCardForm from "@/components/credit-cards/CreditCardForm";
import type { CreditCard } from "@/lib/types";
import CreditCardTile from "@/components/credit-cards/CreditCardTile";

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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.creditCards.map(card => (
            <CreditCardTile 
                key={card.id} 
                card={card} 
                selectedDate={selectedDate}
                onEdit={handleEditCard}
                onDelete={handleDeleteCard}
            />
        ))}
      </div>

      {data.creditCards.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p>No credit cards found. Click 'Add Card' to get started.</p>
        </div>
      )}


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
