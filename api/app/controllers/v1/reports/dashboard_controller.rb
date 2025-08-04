class V1::Reports::DashboardController < ApplicationController
    # incomes
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

    # expenses
    def all_by_month_year_by_category
        @expenses = Expense.all_by_month_year_by_category(params[:month_year]).page(params[:page]).per(params[:per_page] || 50)

        resultado = @expenses.map do |expense|
            {
                category: {
                    summary: expense.category.summary,
                    color: expense.category.color
                },
                total: expense.total.to_f
            }
        end
        
        render json: resultado
    end

    # incomes and expenses total
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

    # expenses
    def most_frequents_by_month_year
        render json: Expense.most_frequents_on_current_month(params[:month_year]).map { |e| { summary: e.summary, qtd: e.qtd.to_i, total: e.total.to_f } }
    end

    # expenses
    def all_current_week
        render json: Expense.all_current_week_total_by_day.map{|e| { day: e.day_name.strip, total: e.total.to_f }}
    end

    def data
        month_year = params[:month_year]
        year = month_year[2..5]
        page = params[:page]
        per_page = params[:per_page] || 50

        incomes = Transaction.sum_by_kind_and_month_year(:income, month_year)
        expenses = Transaction.sum_by_kind_and_month_year(:expense, month_year)
        available = incomes - expenses

        expenses_by_category = Transaction.by_kind_and_month_year_per_category(:expense, month_year)
                                          .page(page)
                                          .per(per_page)

        grouped_by_category = expenses_by_category.map do |expense|
            {
                category: {
                    summary: expense.category.summary,
                    color: expense.category.color
                },
                total: expense.total.to_f
            }
        end

        total_by_months = build_total_by_months(year.to_i)

        most_frequents = Transaction.by_month_year_expenses_most_frequents(month_year).map do |e|
            {
                summary: e.summary,
                qtd: e.qtd.to_i,
                total: e.total.to_f
            }
        end

        current_week = Transaction.expenses_on_current_week_total_by_day.map do |e|
            {
                day: e.day_name.strip,
                total: e.total.to_f
            }
        end

        render json: {
            summary: {
                incomes: "R$ #{'%.2f' % incomes}",
                expenses: "R$ #{'%.2f' % expenses}",
                available: "R$ #{'%.2f' % available}"
            },
            expenses_by_category: grouped_by_category,
            total_by_months: total_by_months,
            most_frequents: most_frequents,
            current_week: current_week
        }
    end

    private

    def build_total_by_months(year)
        expenses = Transaction.total_months_by_kind_per_year(:expense, year.to_i)
        incomes  = Transaction.total_months_by_kind_per_year(:income,  year.to_i)

        # Hashes com chave sendo "Jan", "Feb", etc.
        expenses_hash = expenses.index_by(&:month)
        incomes_hash  = incomes.index_by(&:month)

        meses = %w[Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec]

        meses.map do |mes|
            {
            month: mes,
            incomes: incomes_hash[mes]&.total.to_f,
            expenses: expenses_hash[mes]&.total.to_f
            }
        end
    end

end