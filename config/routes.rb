Rails.application.routes.draw do
  devise_for :users 
  resources :settings

  resources :cards
  resources :revenues
  
  resources :plannings
  resources :planning_incomes, path: 'planning-incomes'
  resources :planning_expenses, path: 'planning-expenses'
  resources :planning_expense_categories, path: 'planning-expense-categories'
  
  root to: redirect('/plannings')
end
