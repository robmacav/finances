import { useState } from "react"

import { apiUrl } from "@/lib/api";

import {
  AlertDialog, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter,
  AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog"

import { toast } from "sonner"

import { type RowSelectionState } from "@tanstack/react-table";

import { deleteMultiplesTransactions } from "@/api/transaction";
import { Button } from "@/components/ui/button";
import { Trash, Trash2 } from "lucide-react";
import React from "react";

type NewProps = {
    isDeleteDialogOpen?: boolean;
    setIsDeleteDialogOpen?: any;
    transactionIDs: [];
    onTransactionsDeleted: () => void;
    setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
};

export default function DeleteMultiplesDialog(
    { 
        transactionIDs, 
        onTransactionsDeleted, 
        setRowSelection 
    }: NewProps) {
        const [isDeleteMultiplesDialogOpen, setIsDeleteMultiplesDialogOpen] = React.useState(false);
        
    const confirmDelete = async () => {
        if (!transactionIDs) return;

        const payload = {
            ids: transactionIDs
        };

        try {
            const response = await deleteMultiplesTransactions(payload);

            if (response.ok) {
                toast.success("Transações excluídas com sucesso!");

                setRowSelection({});

                onTransactionsDeleted();
            } else {
                setRowSelection({});
                toast.error("Ocorreu um erro ao excluir as transações!");
            }
        } catch (err) {
            toast.error("Ocorreu um erro ao excluir as transações.");
            console.log("Erro ao excluir as transações:", err);
        }
    }

    return (
        <div className="flex justify-between items-center">
            < Button onClick={() => setIsDeleteMultiplesDialogOpen(true)} >
                <Trash className="mr-1" />
                <span className="hidden sm:inline">Excluir</span>
            </Button>
            <AlertDialog open={isDeleteMultiplesDialogOpen} onOpenChange={setIsDeleteMultiplesDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza que deseja excluir as transações selecionadas?</AlertDialogTitle>
                    <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmDelete}>Excluir</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}