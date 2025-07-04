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
      end
    end

    namespace :utils do
      scope :expenses do
        get "month-availables", to: "expenses#month_availables"
        get "categories", to: "expenses#categories"
      end
    end
  end
end
