class V1::Reports::DashboardController < ApplicationController
    include CurrencyFormatable

    def data
        month_year = params[:month_year]
        year = month_year[2..5]
        page = params[:page]
        per_page = params[:per_page] || 50

        month = params[:month_year][0..1].to_i
        year_c  = params[:month_year][2..5].to_i
        month_year = params[:month_year]
        current_date = Date.new(year_c, month, 1)

        prev_month_date = current_date.prev_month
        prev_month_year_str = prev_month_date.strftime("%m%Y")

        incomes_current  = Transaction.sum_by_kind_and_month_year(:income, month_year, 3)
        expenses_current = Transaction.sum_by_kind_and_month_year(:expense, month_year, 2)
        available_current = incomes_current - expenses_current

        incomes_prev  = Transaction.sum_by_kind_and_month_year(:income, prev_month_year_str, 3)
        expenses_prev = Transaction.sum_by_kind_and_month_year(:expense, prev_month_year_str, 2)
        available_prev = incomes_prev - expenses_prev



        expenses_by_category = Transaction.by_kind_and_month_year_per_category(:expense, month_year, 2)
                                          .page(page)
                                          .per(per_page)

grouped_by_category = expenses_by_category.map do |expense|
  transactions = Transaction.where(
    kind: :expense,
    category_id: expense.category_id,
    status_id: 2,
    date: Transaction.date_range_by_month_year_string(month_year)
  )

  {
    category: {
      summary: expense.category.summary,
      color: expense.category.color
    },
    total: {
      original: expense.total.to_f,
      formated: format_currency(expense.total)
    },
    items: transactions.map do |t|
      {
        id: t.id,
        summary: t.summary,
        value: t.value.to_f,
        date: t.date,
        formated: format_currency(t.value)
      }
    end
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
                incomes: {
                    value: format_currency(incomes_current),
                    insight: calc_insight(incomes_current, incomes_prev)
                },

                expenses: {
                    value: format_currency(expenses_current),
                    insight: calc_insight(expenses_current, expenses_prev)
                },

                available: {
                    value: format_currency(available_current),
                    insight: calc_insight(available_current, available_prev)
                }
            },
            expenses_by_category: grouped_by_category,
            total_by_months: total_by_months,
            most_frequents: most_frequents,
            current_week: {
                data: current_week,
                insight: weekly_expense_insight
            }
        }
    end

    private

    def build_total_by_months(year)
        expenses = Transaction.total_months_by_kind_per_year(:expense, year.to_i)
        incomes  = Transaction.total_months_by_kind_per_year(:income,  year.to_i)

        expenses_hash = expenses.index_by(&:month)
        incomes_hash  = incomes.index_by(&:month)

        # Últimos 6 meses, incluindo o mês atual
        meses = (0..5).map { |i| (Date.today << i).strftime("%b") }.reverse

        meses.map do |mes|
            income_total  = incomes_hash[mes]&.total.to_f
            expense_total = expenses_hash[mes]&.total.to_f

            if income_total != 0 || expense_total != 0
            {
                month: mes,
                incomes: income_total,
                expenses: expense_total
            }
            end
        end.compact
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

        status = if previous_total.zero? && current_total.zero?
                    :no_expenses
                elsif previous_total.zero?
                    :increase
                elsif current_total.zero?
                    :decrease
                elsif percent_diff.positive?
                    :increase
                elsif percent_diff.negative?
                    :decrease
                else
                    :stable
                end

        insight = case status
                    when :no_expenses
                        "Você não teve despesas nem nesta nem na semana anterior."
                    when :increase
                        if previous_total.zero?
                            "Você teve um aumento de 100% nas despesas em relação à semana anterior."
                        else
                            "Suas despesas aumentaram #{percent_diff}% em relação à semana anterior."
                        end
                    when :decrease
                        if current_total.zero?
                            "Suas despesas caíram 100% em relação à semana anterior."
                        else
                            "Suas despesas diminuíram #{percent_diff.abs}% em relação à semana anterior."
                        end
                    when :stable
                        "Suas despesas se mantiveram estáveis em relação à semana anterior."
                    end

        { description: insight, status: status }
    end


    def calc_insight(current, previous)
        return "Sem dados do mês passado" if previous.to_f.zero?
        diff_percent = ((current - previous) / previous.to_f * 100).round(2)
        sinal = diff_percent > 0 ? "+" : ""
        "#{sinal}#{diff_percent}% em relação ao mês passado"
    end
end