class V1::Utils::DashboardController < ApplicationController
    def incomes_expenses_available_by_month_year
        @incomes = Income.all_by_month_year_sum(params[:month_year])
        @expenses = Expense.all_by_month_year_sum(params[:month_year])
        @available = @incomes - @expenses

        render json: {
            incomes: "R$ #{@incomes}",
            expenses: "R$ #{@expenses}",
            available: "R$ #{@available}",
        }
    end

    def current_year_total_months
        dados = Expense.current_year_total_months

        # Cria hash { "MMYYYY" => total }
        dados_hash = dados.index_by(&:month_year)

        # Meses abreviados em português
        meses = %w[Jan Fev Mar Abr Mai Jun Jul Ago Set Out Nov Dez]

        # Ano atual
        ano = Time.current.year

        # Garante os 12 meses, preenchendo com 0.0 se não tiver dados
        resultado = (1..12).map do |mes|
            chave = format('%02d%04d', mes, ano) # exemplo: "012025"

            {
                name: meses[mes - 1],
                total: dados_hash[chave]&.total.to_f
            }
        end

        render json: resultado
    end
end