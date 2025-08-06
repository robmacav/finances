class V1::Reports::DashboardController < ApplicationController
    include CurrencyFormatable

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
                total: {
                    original: expense.total.to_f,
                    formated: format_currency_without_decimal(expense.total)
                }
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
                incomes: format_currency_without_decimal(incomes),
                expenses: format_currency_without_decimal(expenses),
                available: format_currency_without_decimal(available)
            },
            expenses_by_category: grouped_by_category,
            total_by_months: total_by_months,
            most_frequents: most_frequents,
            current_week: {
                data: current_week,
                status: nil,
                insight: weekly_expense_insight
            }
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

    def weekly_expense_insight
        current_start = Date.today.beginning_of_week(:monday)
        current_end = Date.today.end_of_week(:sunday)

        previous_start = current_start - 7.days
        previous_end = current_end - 7.days

        current_total = Transaction.where(kind: :expense, date: current_start..current_end).sum(:value)
        previous_total = Transaction.where(kind: :expense, date: previous_start..previous_end).sum(:value)

        percent_diff = if previous_total > 0
                            ((current_total - previous_total) / previous_total.to_f * 100).round(2)
                        else
                            100.0
                        end

        if previous_total.zero? && current_total.zero?
            insight = "Você não teve despesas nem nesta nem na semana anterior."
        elsif previous_total.zero?
            insight = "Você teve um aumento de 100% nas despesas em relação à semana anterior."
        elsif current_total.zero?
            insight = "Suas despesas caíram 100% em relação à semana anterior."
        elsif percent_diff.positive?
            insight = "Suas despesas aumentaram #{percent_diff}% em relação à semana anterior."
        elsif percent_diff.negative?
            insight = "Suas despesas diminuíram #{percent_diff.abs}% em relação à semana anterior."
        else
            insight = "Suas despesas se mantiveram estáveis em relação à semana anterior."
        end

        insight
    end
end