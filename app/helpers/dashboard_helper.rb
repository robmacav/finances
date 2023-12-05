module DashboardHelper
    def dashboard_total_incomes
        "R$ #{Revenue.all_by_current_month_year_sum.to_i}"
    end

    def dashboard_total_expenses
        "R$ #{Expense.all_by_current_month_year_sum.to_i}"
    end

    def dashboard_total_available
        "R$ #{(Revenue.all_by_current_month_year_sum - Expense.all_by_current_month_year_sum).to_i}"
    end

    def dashboard_credit_limit_total_available
        "R$ #{Expense.all_by_current_month_year_with_credit_card_sum.to_i}"
    end
end