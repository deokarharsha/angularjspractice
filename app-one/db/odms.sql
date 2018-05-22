/*
  ODMS
  tables and stored procedures
*/

/*                      tables (tbl)                          */
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

/* table: Folders */
CREATE TABLE [dbo].[Folders](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](50) NOT NULL,
	[desc] [char](150) NOT NULL,
	[parentID] [int] NOT NULL,
	[folderID] [varchar](50) NOT NULL,
	[fieldList] [varchar](max) NULL,
 CONSTRAINT [PK_Folders] PRIMARY KEY CLUSTERED
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [IX_Folders] UNIQUE NONCLUSTERED
(
	[name] ASC,
	[desc] ASC,
	[parentID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

/* table: Tags */
CREATE TABLE [dbo].[Tags](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](50) NOT NULL,
	[desc] [varchar](250) NULL,
 CONSTRAINT [PK_Tags] PRIMARY KEY CLUSTERED
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

/* table: jDocs */
CREATE TABLE [dbo].[jDocs](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[folderID] [int] NOT NULL,
	[docID] [varchar](10) NOT NULL,
	[name] [varchar](150) NOT NULL,
	[desc] [varchar](250) NULL,
	[tags] [varchar](max) NOT NULL,
	[fileID] [varchar](50) NOT NULL,
	[uploadDt] [datetime] NOT NULL,
	[isAuth] [bit] NOT NULL CONSTRAINT [DF_jDocs_isAuth]  DEFAULT ((0)),
 CONSTRAINT [PK_jDocs] PRIMARY KEY CLUSTERED
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [IX_jDocs] UNIQUE NONCLUSTERED
(
	[fileID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


/*                stored procedures (sp)                      */
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* stored procedure: getSelectData */
CREATE PROCEDURE [dbo].[getSelectData]
	@tableName varchar(20),
	@coloumnName varchar(20)
WITH ENCRYPTION
AS
BEGIN
	SET NOCOUNT ON;

	IF @tableName = 'Folders'
		EXEC('select 0 as id, ''(Select)'' as name, '''' folderID, '''' [desc], '''' fieldList union Select ID, name, folderID, [desc], fieldList from Folders Where parentID = 0 and len(folderID) >= 28');
	ELSE IF @tableName = 'SubFolders'
		EXEC('select 0 as id, ''(Select)'' as name, '''' folderID, '''' [desc], '''' fieldList
				union
			Select
				sf.ID, sf.name, sf.folderID, f.[desc], sf.fieldList
			from
				Folders sf
				inner join Folders f on f.ID = sf.parentID and f.parentID = 0
			Where
				sf.parentID <> 0	and
				len(sf.folderID) >= 28');
	ELSE
		EXEC('select 0 as id, ''(Select)'' as name union Select ID, ' + @ColoumnName +' from ' + @tableName);
END
GO

/* stored procedure: getSearchData */
-- =============================================
-- Author:		Vinod Tank
-- Create date: 01 Dec 2016
-- Description:	Dynamic search in any table
-- =============================================
CREATE PROCEDURE [dbo].[getSearchData]
	@tableName	varchar(20),
	@searchStr	varchar(100)
WITH ENCRYPTION
AS
BEGIN
	SET NOCOUNT ON;

	IF @tableName = 'Folders'
		EXEC('Select *, case when len(folderID) = 8 then 1 else 0 end hasError
			 from Folders Where parentID = 0 and name like ''%' + @searchStr + '%''')
	ELSE IF @tableName = 'Sub-Folders'
		EXEC('Select *, case when len(folderID) = 8 then 1 else 0 end hasError
			 from Folders Where parentID <> 0 and name like ''%' + @searchStr + '%''')
	ELSE IF @tableName = 'AuthDocs'
		EXEC('Select
				d.ID, docID, d.name, replace(tags, '';'', '', '') tags,
				f.name + ''/'' + sf.name location,
				fileID, isAuth
			from
				jDocs d
				inner join Folders sf on sf.ID = d.folderID
				inner join Folders f on f.ID = sf.parentID
			Where
				isAuth = 0')
	ELSE IF @tableName = 'jDocs'
		EXEC('Select
				d.ID, docID, d.name, replace(tags, '';'', '', '') tags,
				f.name + ''/'' + sf.name location,
				fileID
			from
				jDocs d
				inner join Folders sf on sf.ID = d.subHeadID
				inner join Folders f on f.ID = sf.parentID
			Where
				isAuth = 1	and
				isNULL(d.[desc],'''') + ''|'' + tags like ''%' + @searchStr + '%''')
	ELSE
		EXEC('Select * from ' + @tableName + '')
END
GO

/* stored procedure: getEditData */
CREATE PROCEDURE [dbo].[getEditData]
	@tableName varchar(20),
	@ID int
WITH ENCRYPTION
AS
BEGIN
	SET NOCOUNT ON;

	EXEC('SELECT * FROM ' + @tablename + ' where ID = ' + @ID)
END
GO

/* stored procedure: doFolders */
CREATE PROCEDURE doFolders
	@action		varchar(10),
	@ID			int,
	@name		varchar(50),
	@desc		char(150),
	@parentID	int,
	@folderID	varchar(50),
	@fieldList	varchar(max)
WITH ENCRYPTION
AS
BEGIN
	SET NOCOUNT ON;

    IF @action = 'add'
	Begin
		INSERT INTO
			Folders
			(
				name,
				[desc],
				parentID,
				folderID,
				fieldList
			)
		OUTPUT INSERTED.ID
		values
			(
				@name,
				@desc,
				@parentID,
				@folderID,
				@fieldList
			)
	End
	ELSE IF @action = 'update'
	Begin
		UPDATE
			Folders
		SET
			name		= @name,
			[desc]		= @desc,
			folderID	= @folderID,
			fieldList	= @fieldList
		where
			ID		= @ID
	End
END
GO

/* stored procedure: doTags */
CREATE PROCEDURE [dbo].[doTags]
	@ID			int,
	@name		varchar(25),
	@desc       varchar(100)
WITH ENCRYPTION
AS
BEGIN
	SET NOCOUNT ON;

	IF @ID = 0
	Begin
		INSERT INTO
		Tags
		(
			name,
			[desc]
		)
		VALUES
		(
			@name,
			@desc
		)
	End
	ELSE
	Begin
		UPDATE
			Tags
		SET
			name	= @name,
			[desc]	= @desc
		WHERE
			ID		= @ID
	End
END
GO

/* stored procedure: doJDocs */
CREATE PROCEDURE doJDocs
	@action         varchar(10),
	@ID				int,
	@folderID		int,
	@docID			varchar(10),
	@name			varchar(150),
	@desc			varchar(250),
	@tags			varchar(max),
	@fileID			varchar(50),
	@isAuth			bit
WITH ENCRYPTION
AS
BEGIN
	SET NOCOUNT ON;

	IF @action = 'add'
	begin
		INSERT INTO
		jDocs
		(
			folderID,
			docID,
			name,
			[desc],
			tags,
			fileID,
			uploadDt,
			isAuth
		)
		values
		(
			@folderID,
			@docID,
			@name,
			@desc,
			@tags,
			@fileID,
			getdate(),
			0
		)

		DECLARE @newDocID varChar(10)
		SET	@newDocID = LEFT(@docId,2) +
						RIGHT(convert(varchar(4), Year(getDate())), 2) +
						RIGHT('0' + convert(varchar(2), Month(getDate())), 2) +
						  (SELECT Right('000' + Convert(varChar(4),
						   (SELECT
								IsNULL(MAX(Right(docID,4)),0) + 1
							FROM
								jDocs
							WHERE
								docID LIKE LEFT(@docID,2) +
								RIGHT(convert(varchar(4), Year(getDate())), 2) +
								RIGHT('0' + convert(varchar(2), Month(getDate())), 2) +
								'%'
								and docID <> @docID
								and Isnumeric(substring(docID,9,1))=1)),4))

		-- Update jDocs table
		UPDATE
			jDocs
		SET
			docID = @newDocID
		WHERE
			docID = @DocID

		select @newDocID as newDocID
	end
	ELSE IF @action = 'rename'
	begin
		UPDATE
			jDocs
		SET
			name		= @name,
			fileID		= @fileID
		WHERE
			docID = @docID
	end
	ELSE IF @action = 'update'
	begin
		UPDATE
			jDocs
		SET
			[desc]		= @desc,
			tags		= @tags
		WHERE
			docID		= @docID
	end
	ELSE IF @action = 'move'
	begin
		UPDATE
			jDocs
		SET
			folderID	= @folderID
		WHERE
			ID		= @ID
	end
	ELSE IF @action = 'authorize'
	begin
		UPDATE
			jDocs
		SET
			isAuth	= @isAuth
		WHERE
			ID		= @ID
	end
	ELSE IF @action = 'delete'
	begin
		DELETE FROM
			jDocs
		WHERE
			ID = @ID
	end
END
GO

/* stored procedure: viewDocs */
CREATE PROCEDURE [dbo].[viewDocs]
	@folderID int
WITH ENCRYPTION
AS
BEGIN
	SET NOCOUNT ON;

	Select
			d.ID, docID, d.name, replace(tags, ';', ', ') tags,
			d.[desc], fileID, Convert(varChar(15), d.uploadDt, 103) uploadDt
		  from
			jDocs d
			inner join Folders sf on sf.ID = d.folderID
			inner join Folders f on f.ID = sf.parentID
		  Where
			isAuth = 1	and
			d.folderID = @folderID;
END
GO

/* stored procedure: searchDocs */
CREATE PROCEDURE [dbo].[searchDocs]
	@searchStr varchar(150)
WITH ENCRYPTION
AS
BEGIN
	SET NOCOUNT ON;

		Select
				d.ID, docID, d.name, replace(tags, ';', ', ') tags, d.[desc],
				f.name + '/' + sf.name location,
				fileID, Convert(varChar(15), d.uploadDt, 103) uploadDt
			from
				jDocs d
				inner join Folders sf on sf.ID = d.folderID
				inner join Folders f on f.ID = sf.parentID
			Where
				isAuth = 1	and
				f.name + '/' + sf.name + '|' + isNULL(d.[desc], '') + '|' + replace(tags, ';', ', ') like '%' + @searchStr + '%'
END
GO
