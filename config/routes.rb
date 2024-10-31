Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  root 'dashboard#index'

  resources :cards
  resources :incomes
  resources :expense_categories
  resources :expenses
end
