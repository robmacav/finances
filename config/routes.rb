Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    resources :incomes
    resouces :expenses
    resources :categories
  end

  namespace :web do
    resources :incomes
    resources :expenses
    resources :categories
  end
end
