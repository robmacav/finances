module ApplicationHelper
    include Pagy::Frontend
    
    def decimal_to_float(value)
        integer, decimal = format('%.2f', value).split('.')
        integer.reverse.gsub(/(\d{3})(?=\d)/, '\1.').reverse + ',' + decimal
    end
      

    def planning_total_incomes(planning)
        "R$ #{decimal_to_float(planning.incomes.sum(:value))}"
    end

    def planning_total_expenses(planning)
        "R$ #{decimal_to_float(planning.expenses.sum(:value))}"
    end

    def planning_total_available(planning)
        "R$ #{decimal_to_float(planning.incomes.sum(:value) - planning.expenses.sum(:value))}"
    end
end
