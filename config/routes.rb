Rails.application.routes.draw do
  resources :plannings
  resources :planning_incomes, path: 'planning-incomes'
  
  root to: redirect('/plannings')
end
