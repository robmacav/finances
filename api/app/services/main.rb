class Main
    def call
        puts "Iniciando cópia de dados de produção para desenvolvimento..."
    
        copiados = 0

        ProdTransaction.find_each(batch_size: 1000) do |prod_tx|
            DevTransaction.create!(
                id: prod_tx.id,
                summary: prod_tx.summary,
                details: prod_tx.details,
                value: prod_tx.value,
                date: prod_tx.date,
                transaction_kind_id: prod_tx.transaction_kind_id,
                status_id: prod_tx.status_id,
                category_id: prod_tx.category_id,
                user_id: prod_tx.user_id,
                created_at: prod_tx.created_at,
                updated_at: prod_tx.updated_at
            )

            copiados += 1
        end
    end
end