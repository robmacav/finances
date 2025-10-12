class CreateTransactionKinds < ActiveRecord::Migration[7.1]
  def change
    create_table :transaction_kinds do |t|
      t.string :summary

      t.timestamps
    end
  end
end
