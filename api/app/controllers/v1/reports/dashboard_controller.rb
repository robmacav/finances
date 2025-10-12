class V1::Reports::DashboardController < ApplicationController
  include CurrencyFormatable

  def data
    render json: {
      summary: build_summary,
      expenses_by_category: build_expenses_by_category,
      total_by_months: build_total_by_months,
      most_frequents: build_most_frequents,
      current_week: build_current_week
    }
  end

  private

  def month_year
    @month_year ||= params[:month_year]
  end

  def current_date
    @current_date ||= Date.new(month_year[2..5].to_i, month_year[0..1].to_i, 1)
  end

  def prev_month_year
    @prev_month_year ||= current_date.prev_month.strftime("%m%Y")
  end

  def build_summary
    incomes_current = Transaction.sum_by_kind_and_month_year(:income, month_year, :received)
    expenses_current = Transaction.sum_by_kind_and_month_year(:expense, month_year, :paid)
    available_current = incomes_current - expenses_current

    incomes_prev = Transaction.sum_by_kind_and_month_year(:income, prev_month_year, :received)
    expenses_prev = Transaction.sum_by_kind_and_month_year(:expense, prev_month_year, :paid)
    available_prev = incomes_prev - expenses_prev

    {
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
    }
  end

  def build_expenses_by_category
    page = params[:page]
    per_page = params[:per_page] || 50

    expenses_by_category = Transaction
      .by_kind_and_month_year_per_category(:expense, month_year, :paid)
      .page(page)
      .per(per_page)

    expenses_by_category.map do |expense|
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
        items: transactions
          .group_by(&:summary)
          .map do |summary, trans|
            total_value = trans.sum { |t| t.value.to_f }
            {
              id: trans.first.id,
              summary: "#{summary} (#{trans.size})",
              value: total_value,
              date: trans.first.date,
              formated: format_currency(total_value)
            }
          end
          .sort_by { |t| -t[:value] }
      }
    end
  end

  def build_total_by_months
    year = month_year[2..5].to_i
    
    expenses = Transaction.total_months_by_kind_per_year(:expense, year, :paid)
    incomes = Transaction.total_months_by_kind_per_year(:income, year, :received)

    expenses_hash = expenses.index_by(&:month)
    incomes_hash = incomes.index_by(&:month)

    last_six_months = (0..5).map { |i| (Date.today << i).strftime("%b") }.reverse

    last_six_months.map do |month|
      income_total = incomes_hash[month]&.total.to_f
      expense_total = expenses_hash[month]&.total.to_f

      next if income_total.zero? && expense_total.zero?

      {
        month: month,
        incomes: income_total,
        expenses: expense_total
      }
    end.compact
  end

  def build_most_frequents
    Transaction.by_month_year_expenses_most_frequents(month_year, :paid).map do |expense|
      {
        summary: expense.summary,
        qtd: expense.qtd.to_i,
        total: expense.total.to_f
      }
    end
  end

  def build_current_week
    current_week_data = Transaction.expenses_on_current_week_total_by_day(:paid).map do |expense|
      {
        day: expense.day_name.strip,
        total: expense.total.to_f
      }
    end

    {
      data: current_week_data,
      insight: weekly_expense_insight
    }
  end

  def weekly_expense_insight
    current_start = Date.today.beginning_of_week(:monday)
    current_end = Date.today.end_of_week(:sunday)
    previous_start = current_start - 7.days
    previous_end = current_end - 7.days

    current_total = Transaction.where(kind: :expense, date: current_start..current_end).sum(:value)
    previous_total = Transaction.where(kind: :expense, date: previous_start..previous_end).sum(:value)

    percent_diff = previous_total > 0 ? ((current_total - previous_total) / previous_total.to_f * 100).round(2) : 100.0

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
                previous_total.zero? ?
                  "Você teve um aumento de 100% nas despesas em relação à semana anterior." :
                  "Suas despesas aumentaram #{percent_diff}% em relação à semana anterior."
              when :decrease
                current_total.zero? ?
                  "Suas despesas caíram 100% em relação à semana anterior." :
                  "Suas despesas diminuíram #{percent_diff.abs}% em relação à semana anterior."
              when :stable
                "Suas despesas se mantiveram estáveis em relação à semana anterior."
              end

    { description: insight, status: status }
  end

  def calc_insight(current, previous)
    return "Sem dados do mês passado" if previous.to_f.zero?
    
    diff_percent = ((current - previous) / previous.to_f * 100).round(2)
    signal = diff_percent > 0 ? "+" : ""
    
    "#{signal}#{diff_percent}% em relação ao mês passado"
  end
end