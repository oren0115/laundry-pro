# ERD - Laundry Management System

```mermaid
erDiagram
    Branch ||--o{ User : has
    Branch ||--o{ Customer : has
    Branch ||--o{ Order : has
    Branch ||--o{ Inventory : has
    Branch ||--o{ Employee : has
    Branch ||--o{ PickupDelivery : has
    Branch ||--o{ Expense : has

    User ||--o| Customer : "is"
    User ||--o| Employee : "is"
    User ||--o{ RefreshToken : has
    User ||--o{ OrderStatusLog : updates
    User ||--o{ AuditLog : creates
    User ||--o{ LoginHistory : has
    User ||--o{ PickupDelivery : "courier"

    Customer ||--o{ Order : places
    Customer ||--o{ PickupDelivery : requests

    Service ||--o{ Order : "used in"

    Order ||--o{ OrderStatusLog : tracks
    Order ||--o| PickupDelivery : "optional"

    Employee ||--o{ Shift : has
    Employee ||--o{ Attendance : records
```

## Relasi Utama

| Entitas | Relasi | Keterangan |
|---------|--------|------------|
| Branch | 1:N User, Customer, Order | Multi-cabang |
| User | 1:1 Customer/Employee | Role-based |
| Customer | 1:N Order | Riwayat transaksi |
| Order | 1:N OrderStatusLog | Timeline tracking |
| Service | 1:N Order | Jenis layanan |
