/*
  JulietONE
  tables and stored procedures
*/

/*                      tables (tbl)                          */
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

/* table: Apps */
CREATE TABLE [dbo].[Apps](
	[ID] [tinyint] IDENTITY(1,1) NOT NULL,
	[name] [varchar](50) NOT NULL,
 CONSTRAINT [PK_Apps] PRIMARY KEY CLUSTERED
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [IX_Apps] UNIQUE NONCLUSTERED
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

/* table: DBConfig */
CREATE TABLE [dbo].[DBConfig](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[appID] [tinyint] NOT NULL,
	[name] [varchar](50) NOT NULL,
	[dbName] [varchar](20) NOT NULL,
	[hasDivisions] [bit] NOT NULL CONSTRAINT [DF_DBConfig_hasDivisions]  DEFAULT ((0)),
 CONSTRAINT [PK_DBConfig] PRIMARY KEY CLUSTERED
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [IX_DBConfig] UNIQUE NONCLUSTERED
(
	[dbName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[DBConfig]  WITH CHECK ADD  CONSTRAINT [FK_DBConfig_Apps] FOREIGN KEY([appID])
REFERENCES [dbo].[Apps] ([ID])
GO

ALTER TABLE [dbo].[DBConfig] CHECK CONSTRAINT [FK_DBConfig_Apps]
GO

/* table: Users */
CREATE TABLE [dbo].[Users](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[userName] [varchar](50) NOT NULL,
	[displayName] [varchar](50) NOT NULL,
	[password] [varchar](150) NOT NULL,
	[userType] [varchar](25) NOT NULL,
	[isActive] [bit] NOT NULL CONSTRAINT [DF_Users_IsActive]  DEFAULT ((0)),
	[timeStamp] [smalldatetime] NOT NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [IX_Users] UNIQUE NONCLUSTERED
(
	[userName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

/* table: DBAccess */
CREATE TABLE [dbo].[DBAccess](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[dbID] [int] NOT NULL,
	[userID] [int] NOT NULL,
	[canAccess] [bit] NOT NULL CONSTRAINT [DF_DBAccess_IsAccess]  DEFAULT ((0)),
 CONSTRAINT [PK_DBAccess] PRIMARY KEY CLUSTERED
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[DBAccess]  WITH CHECK ADD  CONSTRAINT [FK_DBAccess_DBConfig] FOREIGN KEY([dbID])
REFERENCES [dbo].[DBConfig] ([ID])
GO

ALTER TABLE [dbo].[DBAccess] CHECK CONSTRAINT [FK_DBAccess_DBConfig]
GO

ALTER TABLE [dbo].[DBAccess]  WITH CHECK ADD  CONSTRAINT [FK_DBAccess_Users] FOREIGN KEY([userID])
REFERENCES [dbo].[Users] ([ID])
GO

ALTER TABLE [dbo].[DBAccess] CHECK CONSTRAINT [FK_DBAccess_Users]
GO

/* table: Modules */
CREATE TABLE [dbo].[Modules](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[appID] [tinyint] NOT NULL,
	[parentID] [int] NOT NULL CONSTRAINT [DF_Modules_ParentId]  DEFAULT ((0)),
	[name] [varchar](50) NOT NULL,
	[action] [varchar](150) NOT NULL,
	[icon] [varchar](20) NULL,
	[sortID] [smallint] NOT NULL,
	[tblName] [varchar](50) NULL,
	[para] [varchar](20) NULL,
 CONSTRAINT [PK_Modules] PRIMARY KEY CLUSTERED
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

/* table: ModuleAccess */
CREATE TABLE [dbo].[ModuleAccess](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[modID] [int] NOT NULL,
	[userID] [int] NOT NULL,
	[canAdd] [bit] NOT NULL CONSTRAINT [DF_ModuleAccess_CanAdd]  DEFAULT ((0)),
	[canEdit] [bit] NOT NULL CONSTRAINT [DF_ModuleAccess_CanEdit]  DEFAULT ((0)),
	[canDelete] [bit] NOT NULL CONSTRAINT [DF_ModuleAccess_CanDelete]  DEFAULT ((0)),
	[canAccess] [bit] NOT NULL CONSTRAINT [DF_ModuleAccess_IsAccess]  DEFAULT ((0)),
 CONSTRAINT [PK_ModuleAccess] PRIMARY KEY CLUSTERED
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[ModuleAccess]  WITH CHECK ADD  CONSTRAINT [FK_ModuleAccess_Modules] FOREIGN KEY([modID])
REFERENCES [dbo].[Modules] ([ID])
GO

ALTER TABLE [dbo].[ModuleAccess] CHECK CONSTRAINT [FK_ModuleAccess_Modules]
GO

ALTER TABLE [dbo].[ModuleAccess]  WITH CHECK ADD  CONSTRAINT [FK_ModuleAccess_Users] FOREIGN KEY([userID])
REFERENCES [dbo].[Users] ([ID])
GO

ALTER TABLE [dbo].[ModuleAccess] CHECK CONSTRAINT [FK_ModuleAccess_Users]
GO

/* table: IPTable */
CREATE TABLE [dbo].[IPTable](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[ipAddress] [varchar](50) NOT NULL,
	[desc] [varchar](50) NULL
) ON [PRIMARY]
GO

/* table: LoginInfo */
CREATE TABLE [dbo].[LoginInfo](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[userID] [int] NOT NULL,
	[logedInTime] [datetime] NOT NULL
 CONSTRAINT [PK_LoginInfo] PRIMARY KEY CLUSTERED
(
	[userID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

SET ANSI_PADDING OFF
GO

/*                stored procedures (sp)                      */
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

/* stored procedure: ProcessRequest */
-- =============================================
-- Author:		Vinod Tank
-- Create date: 15 Sep 2015
-- Description:	Process the Stored Procedure
--				and return data
-- =============================================
CREATE PROCEDURE [dbo].[ProcessRequest]
	@Method			varchar(10),
	@Name			varchar(150),
	@Values			varchar(max)
WITH ENCRYPTION
AS
BEGIN
	SET NOCOUNT ON;

	Declare @Parameters varchar(max)
	SET @Parameters = REPLACE( REPLACE( '''' + REPLACE(@Values, ',', ''',''') + '''' , '''undefined''', 'NULL'), '''''', 'NULL')

	Exec(@Name + ' ' + @Parameters)
END
GO

/* stored procedure: AuthorizeUser */
-- ============================================================================================
-- Author:		Vinod Tank
-- Create date: 15 Sep 2015
-- Description:	Authorise the User if UserName, Password is matched along with is Active status.
-- Update date: 10 Nov 2015
--				Return Config data along with success attempt.
-- Update date: 19 Feb 2018
--				Add unique token to maintain user session information.
-- ============================================================================================
CREATE PROCEDURE dbo.AuthorizeUser
	@userName	varchar(50),
	@password	varchar(150)
WITH ENCRYPTION
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @authorized bit
	DECLARE @userType varchar(25)

	SET @authorized =
		(Select
			Count(userName)
		from
			Users
		where
			userName		= @userName
			and [password]	= HASHBYTES('MD5', @password)
			and isActive	= 1
		)

	If @authorized = 1
		Select
			u.ID, u.userName name, u.displayName, IsNull(u.userType, 'none') as userType,
			lower(left(newID(), 8)) token,
			'Success!' Response
		from
			Users u
		Where
			u.userName = @userName
	Else
		Select 'Failed.' Response
END
GO

/* stored procedure: doApps */
CREATE PROCEDURE [dbo].[doApps]
	@ID			int,
	@name		varchar(50)
WITH ENCRYPTION
AS
BEGIN
	SET NOCOUNT ON;

	IF @ID = 0
		Insert into Apps
			(name)
		values
			(@name);
	ELSE
		Update Apps
		SET
			name = @name
		WHERE
			ID	= @ID;
END
GO

/* stored procedure: getDBs */
CREATE PROCEDURE getDBs
	@userID		int
WITH ENCRYPTION
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @userType varchar(25)
	SET @userType = (Select Top 1 userType from Users Where ID = @userID)

	If @userType <> 'Developer'
		Select
			app.ID	appID, app.name appName,
			dbc.name name, dbc.dbName, dbc.hasDivisions
		From
			Apps app
			inner join DBConfig dbc on dbc.appID = app.ID
			inner join DBAccess dba on dba.dbID = dbc.ID
		Where
			dba.userID		=	@userID	and
			dba.canAccess	=	1
		Order by
			app.name, dbc.name
	Else
		Select
			0 appID, 'Core' appName,
			'Juliet ONE' name, 'JulietONE' dbName, 0 hasDivisions
		UNION ALL
		Select
			app.ID	appID, app.name appName,
			dbc.name name, dbc.dbName, dbc.hasDivisions
		From
			Apps app
			inner join DBConfig dbc on dbc.appID = app.ID
		Order by
			appName, name
END
GO
--getDBs 1

/* stored procedure: getModules */
CREATE PROCEDURE getModules
	@appID	int,
	@userID	int
WITH ENCRYPTION
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @userType varchar(25)
	SET @userType = (Select Top 1 userType from Users Where ID = @userID)

	If @userType <> 'Developer'
		Select
			m.ID id, m.parentID, m.name, m.action, m.icon, isNull(m.tblName, m.name) tblName
		From
			Modules m
			inner join ModuleAccess ma on ma.ModId = m.Id and ma.UserId = @userID and ma.canAccess = 1
			inner join Users u on u.Id = ma.UserId and u.isActive = 1
		Where
			m.appID = @appID
		Order by
			sortID
	Else
		Select
			m.ID id, m.parentID, m.name, m.action, m.icon, isNull(m.tblName, m.name) tblName
		From
			Modules m
		Where
			m.appID = @appID
		Order by
			appId, sortID
 END
GO

/* stored procedure: getAccessData */
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Vinod Tank
-- Create date: 25/01/2016
-- Description:	Adding records as per given table
-- =============================================
CREATE PROCEDURE getAccessData
	@userID		int,
	@tblName	varchar(15)
WITH ENCRYPTION
AS
BEGIN
	SET NOCOUNT ON;

	If @tblName = 'DBAccess'
	Begin
		Insert DBAccess
		(
			[dbID],
			userID
		)
		Select
			ID, @userID
		from
			DBConfig
		Where
			ID not in (Select [dbID] From DBAccess Where userID = @userID);

		Select
			app.ID appID, app.name appName,
			dbc.ID [dbID], dbc.name, dbc.dbName, dba.canAccess
		from
			DBAccess dba
			inner join DBConfig dbc on dbc.ID = dba.[dbID]
			inner join Apps app on app.ID = dbc.appID
		Where
			userID = @userID;
	End
	Else If @tblName = 'ModuleAccess'
	Begin
		Insert ModuleAccess
		(
			modID,
			userID
		)
		Select
			ID, @userID
		from
			Modules
		Where
			ID not in (Select modID From ModuleAccess Where userID = @userID)	and
			appID <> 0

		Select
			app.ID appID, app.name appName,
			ma.ID modID, m.name modName, ma.canAdd, ma.canEdit, ma.canDelete, ma.canAccess
		from
			ModuleAccess ma
			inner join Modules m on m.ID = ma.modID
			inner join Apps app on app.ID = m.appID
		Where
			userID = @userID
		Order by
			m.appID, m.parentID, m.sortID
	End
END
GO
