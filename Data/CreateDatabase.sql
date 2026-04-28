IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
CREATE TABLE [Students] (
    [StudentId] nvarchar(450) NOT NULL,
    [Name] nvarchar(max) NOT NULL,
    [Pin] nvarchar(4) NOT NULL,
    [FailedLoginAttempts] int NOT NULL,
    [IsLocked] bit NOT NULL,
    CONSTRAINT [PK_Students] PRIMARY KEY ([StudentId])
);

CREATE TABLE [Wallets] (
    [WalletId] nvarchar(450) NOT NULL,
    [StudentId] nvarchar(450) NOT NULL,
    [Balance] decimal(18,2) NOT NULL,
    CONSTRAINT [PK_Wallets] PRIMARY KEY ([WalletId]),
    CONSTRAINT [FK_Wallets_Students_StudentId] FOREIGN KEY ([StudentId]) REFERENCES [Students] ([StudentId]) ON DELETE CASCADE
);

CREATE TABLE [Transactions] (
    [Id] int NOT NULL IDENTITY,
    [WalletId] nvarchar(450) NOT NULL,
    [Amount] decimal(18,2) NOT NULL,
    [Type] int NOT NULL,
    [Timestamp] datetime2 NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [RelatedStudentId] nvarchar(max) NULL,
    CONSTRAINT [PK_Transactions] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Transactions_Wallets_WalletId] FOREIGN KEY ([WalletId]) REFERENCES [Wallets] ([WalletId]) ON DELETE CASCADE
);

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'StudentId', N'FailedLoginAttempts', N'IsLocked', N'Name', N'Pin') AND [object_id] = OBJECT_ID(N'[Students]'))
    SET IDENTITY_INSERT [Students] ON;
INSERT INTO [Students] ([StudentId], [FailedLoginAttempts], [IsLocked], [Name], [Pin])
VALUES (N'S101', 0, CAST(0 AS bit), N'John Doe', N'1234'),
(N'S102', 0, CAST(0 AS bit), N'Jane Smith', N'5678'),
(N'ADMIN001', 0, CAST(0 AS bit), N'System Admin', N'0000');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'StudentId', N'FailedLoginAttempts', N'IsLocked', N'Name', N'Pin') AND [object_id] = OBJECT_ID(N'[Students]'))
    SET IDENTITY_INSERT [Students] OFF;

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'WalletId', N'Balance', N'StudentId') AND [object_id] = OBJECT_ID(N'[Wallets]'))
    SET IDENTITY_INSERT [Wallets] ON;
INSERT INTO [Wallets] ([WalletId], [Balance], [StudentId])
VALUES (N'W101', 1000.0, N'S101'),
(N'W102', 500.0, N'S102'),
(N'W_ADMIN', 0.0, N'ADMIN001');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'WalletId', N'Balance', N'StudentId') AND [object_id] = OBJECT_ID(N'[Wallets]'))
    SET IDENTITY_INSERT [Wallets] OFF;

CREATE INDEX [IX_Transactions_WalletId] ON [Transactions] ([WalletId]);

CREATE UNIQUE INDEX [IX_Wallets_StudentId] ON [Wallets] ([StudentId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260423113728_InitialCreate', N'10.0.7');

COMMIT;
GO

