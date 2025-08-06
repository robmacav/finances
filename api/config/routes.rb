Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :v1 do 
    get 'status', to: 'status#index'
    
    resources :categories
    resources :transactions

    namespace :reports do
      scope :transactions do 
        get "all-by-month-year", to: "transactions#all_by_month_year"
      end

      scope :dashboard do 
        get "data", to: "dashboard#data"
      end
    end

    namespace :utils do
      scope :transactions do 
        get 'form-data', to: 'transactions#form_data'
      end
    end
  end
end
