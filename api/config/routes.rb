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
        get "all-by-month-year-by-category", to: "expenses#all_by_month_year_by_category"
        get 'current-year-total-months', to: 'expenses#current_year_total_months'
      end

      scope :incomes do
        get "by-category-and-month-year", to: "incomes#by_category_and_month_year"
        get "all-by-month-year", to: "incomes#all_by_month_year"
        get "all-by-month-year-by-category", to: "incomes#all_by_month_year_by_category"
        get 'current-year-total-months', to: 'incomes#current_year_total_months'
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
        get "incomes-expenses-total-months-by-year", to: "dashboard#incomes_expenses_total_months_by_year"
      end
    end
  end
end
