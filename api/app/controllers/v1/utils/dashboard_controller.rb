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

    def incomes_expenses_total_months_by_year
        expenses = Expense.total_months_by_year(params[:year])
        incomes = Income.total_months_by_year(params[:year])

        expenses_hash = expenses.index_by(&:month_year)
        incomes_hash = incomes.index_by(&:month_year)

        meses = %w[January February March April May June July August September October November December]
        ano = Time.current.year

        resultado = (1..12).map do |mes|
            chave = format('%02d%04d', mes, ano)

            {
                month: meses[mes - 1],
                incomes: incomes_hash[chave]&.total.to_i,
                expenses: expenses_hash[chave]&.total.to_i
            }
        end

        render json: resultado
    end

    def current_year_total_months
        dados = Expense.current_year_total_months

        dados_hash = dados.index_by(&:month_year)

        meses = %w[Jan Fev Mar Abr Mai Jun Jul Ago Set Out Nov Dez]

        ano = Time.current.year

        resultado = (1..12).map do |mes|
            chave = format('%02d%04d', mes, ano)

            {
                name: meses[mes - 1],
                total: dados_hash[chave]&.total.to_f
            }
        end

        render json: resultado
    end
end