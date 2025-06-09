Rails.application.routes.draw do
  namespace :v1 do 
    resources :incomes
    resources :expenses
    resources :categories
  end

  root "application#about"

  get "up" => "rails/health#show", as: :rails_health_check
end
