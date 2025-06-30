Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :v1 do 
    resources :incomes
    resources :expenses
    resources :categories

    namespace :reports do
      get "expenses/by-category-and-month-year" => "expenses#by_category_and_month_year"
    end

    namespace :utils do
      scope :expenses do
        get "month-availables" => "expenses#month_availables"
        get "categories" => "expenses#categories"
      end
    end
  end
end
