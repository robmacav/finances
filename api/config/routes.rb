Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :v1 do 
    resources :transactions do
      collection do
        patch :batch_update
        delete :batch_destroy
      end
    end

    namespace :reports do
      get "transactions/all-by-month-year", to: "transactions#all_by_month_year"
    end

    namespace :utils do
      get "transactions/form-data", to: "transactions#form_data"
    end
  end
end