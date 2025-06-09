Rails.application.routes.draw do
  namespace :v1 do 
    resources :incomes
    resources :categories
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
