namespace :db do
    desc "Create a user who has an annual plan containing income and expenses."

    task :user_with_annual_planning => :environment do
        user = User.new(first_name: "Test", last_name: "User", email: 'user@finances.me', password: 111111)

        # plannings
        1.upto(12) do |month|
            planning = user.plannings.new(month_year: "#{month.to_s.rjust(2, '0')}#{Date.today.year}")

            # incomes
            1.upto(5) do |index|
                planning.incomes.new(description: "Income #{index.to_s.rjust(2, '0')}", value: Random.rand(100..20000))
            end

            # categories + expenses
            categories = [  
                            { description: 'Category 01', items: [ { description: 'Expense 01', value: 240 } ] },
                            { description: 'Category 02', items: [ { description: 'Expense 02', value: 20 }, { description: 'Expense 03', value: Random.rand(27..36) } ] },
                            { description: 'Category 03', items: [ { description: 'Expense 04', value: 350 }, { description: 'Expense 05', value: Random.rand(200..480) }, { description: 'Expense 06', value: 105 } ] } 
                        ]       

            categories.each do |category|
                user_category = planning.expense_categories.new(description: category[:description])

                category[:items].each do |expense|
                    user_category.expenses.new(description: expense[:description], value: expense[:value])
                end
            end
        end    

        user.save
    end
  end
  