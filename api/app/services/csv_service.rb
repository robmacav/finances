require 'csv'

class CsvService
    def initialize
        @file = Rails.root.join("transactions.csv")
    end

    def call
        dados_negativos = []
        
        CSV.foreach(@file, headers: true, encoding: 'bom|utf-8') do |row|
            valor_str = row["Valor"].to_s.strip
        
            if valor_str.start_with?('-')
                valor_limpo = valor_str.gsub(/[^\d,.-]/, '').gsub(',', '.').to_f * -1
                linha = row.to_h
                linha["Valor"] = valor_limpo

                data = linha["Data"]
                date_obj = Date.strptime(data, '%d/%m/%Y')
                data_formatada = date_obj.strftime('%d%m%Y')

                linha_categoria = linha["Categoria"].strip

                category = Category.find_by(summary: linha_categoria)

                unless category
                    category = Category.create!(
                        summary: linha_categoria,
                        color: SecureRandom.hex(3),
                        user_id: 2
                    )
                end

                category_id = category.id

                Expense.create(
                    summary: linha["Título"],
                    value: linha["Valor"],
                    date: data_formatada,
                    category_id: category_id,
                    user_id: 2,
                    status_id: 2
                )
            end
        end

    end
end