import { useState } from "react"

import { apiUrl } from "@/lib/api";

import {
  AlertDialog, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter,
  AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog"

import { toast } from "sonner"

export default function DeleteDialog({ isDeleteDialogOpen, setIsDeleteDialogOpen, id, refetch }: any) {
    const confirmDelete = async () => {
        if (!id) return;

        try {
            const res = await fetch(`${apiUrl}/transactions/${id}`, { method: "DELETE" });

            if (!res.ok) throw new Error();

            toast.success("Despesa excluída com sucesso!");

            refetch();
        } catch {
            toast.error("Erro ao excluir despesa!");
        } finally {
            setIsDeleteDialogOpen(false);
        }
    }

    return (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza que deseja excluir esta despesa?</AlertDialogTitle>
                <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete}>Excluir</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}