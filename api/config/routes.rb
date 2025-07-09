Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :v1 do 
    resources :incomes
    resources :expenses
    resources :categories

    namespace :reports do
      scope :expenses do 
        get "by-category-and-month-year", to: "expenses#by_category_and_month_year"
        get "all-by-month-year", to: "expenses#all_by_month_year"
        get 'current-year-total-months', to: 'expenses#current_year_total_months'
      end
    end

    namespace :utils do
      scope :incomes do
      end
      
      scope :expenses do
        get "month-availables", to: "expenses#month_availables"
        get "categories", to: "expenses#categories"
        get "first", to: "expenses#first"
      end

      scope :dashboard do
        get "incomes-expenses-available-by-month-year", to: "dashboard#incomes_expenses_available_by_month_year"
      end
    end
  end
end
