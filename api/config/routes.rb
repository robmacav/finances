Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :v1 do 
    resources :transactions do
      collection do
        patch :batch_update
        delete :batch_destroy
      end
    end
  end
end