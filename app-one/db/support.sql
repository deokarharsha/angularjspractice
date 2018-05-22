/*
  jildb
  tables and stored procedures
*/

/*                      tables (tbl)                          */
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

/* table: Tickets */
CREATE TABLE [dbo].[Tickets](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[ticketID] [nvarchar](10) NOT NULL,
	[ticketDt] [datetime] NOT NULL,
	[ticketTime] [smalldatetime] NULL,
	[ticketType] [nvarchar](50) NULL,
	[custID] [int] NULL,
	[name] [nvarchar](50) NOT NULL,
	[email] [nvarchar](50) NOT NULL,
	[contactNo] [nvarchar](15) NULL,
	[prodID] [nvarchar](50) NOT NULL,
	[issueType] [nvarchar](50) NULL,
	[issue] [nvarchar](max) NOT NULL,
	[resolution] [nvarchar](200) NULL,
	[resolvedDt] [datetime] NULL,
	[resolvedTime] [smalldatetime] NULL,
	[isClosed] [bit] NULL,
	[resolvedBy] [nvarchar](50) NULL,
	[location] [varchar](15) NOT NULL,
	[status] [varchar](15) NULL CONSTRAINT [DF_Tickets_status]  DEFAULT ('NEW'),
 CONSTRAINT [PK_Tickets] PRIMARY KEY CLUSTERED
(
	[ticketID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

/* table: TicketHistory */
CREATE TABLE [dbo].[TicketHistory](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[ticketID] [int] NOT NULL,
	[userID] [int] NOT NULL,
	[statusID] [smallint] NOT NULL,
	[date] [smalldatetime] NOT NULL,
	[comments] [varchar](150) NULL
) ON [PRIMARY]
GO

SET ANSI_PADDING OFF
GO

/* stored procedure: doTickets (jildb) */
CREATE PROCEDURE doTickets
	@command	varchar(10),
	@ID			int,
	@ticketID	varchar(10),
	@ticketDt	datetime,
	@custID		int,
	@name		varchar(50),
	@email		varchar(50),
	@prodID		int,
	@issueType	varchar(50),
	@issue		varchar(max),
	@resolution	varchar(200),
	@ip			varchar(15)
WITH ENCRYPTION
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @NewLineChar AS CHAR(2) = CHAR(13) + CHAR(10)

	DECLARE @userID as int = (Select ID from JulietONE.dbo.Users Where userName = @email)

	IF @command = 'add' and @ID = 0
	Begin
		Declare @location varchar(20)
		Set @location = (Select subString([desc], 0, charIndex(' ', [desc])) from JulietONE.dbo.IPTable Where ipAddress = @ip)

		Set @ticketID = 'TS' +
						Right( '0' + Convert(varchar, Month(getDate())) ,2) +
						Right( Convert(varchar,Year(getDate())) ,2);

		Insert into
		Tickets
		(
			ticketID,
			ticketDt,
			ticketTime,
			ticketType,
			custID,
			name,
			email,
			contactNo,
			prodID,
			issueType,
			issue,
			resolution,
			isClosed,
			location,
			[status]
		)
		values
		(
			@ticketID,
			getDate(),
			getDate(),
			'eTicket',
			@custID,
			@name,
			@email,
			NULL,
			@prodID,
			@issueType,
			@issue,
			NULL,
			0,
			@location,
			'NEW'
		);

		DECLARE @NewTicketId	varChar(10)
		SET	@NewTicketId = Left(@ticketID,6) +
						  (SELECT Right('000' + Convert(varChar(4),
						   (SELECT
								IsNULL(MAX(Right(TicketId,4)),0) + 1
							FROM
								Tickets
							WHERE
								TicketId LIKE LEFT(@TicketId,6) + '%'
								And TicketId <> @TicketId
								and Isnumeric(substring(TicketId,9,1))=1)),4));

		-- Update Trans table
		UPDATE
			Tickets
		SET
			TicketId = @NewTicketId
		WHERE
			TicketId = @TicketId


		Select @NewTicketId ticketID
	end
	ELSE IF @command = 'Approve'
	Begin
		Update Tickets SET status = 'APPROVED' Where ID = @ID
		Insert into TicketHistory Values(@ID, @userID, 1, getDate(), NULL)
	End
	ELSE IF @command = 'Assign'
	Begin
		Update Tickets SET status = 'ASSIGNED' Where ID = @ID
		Insert into TicketHistory Values(@ID, @userID, 2, getDate(), @resolution)
	End
	ELSE IF @command = 'Working'
	Begin
		Update
			tickets
		set
			resolution = @resolution,
			resolvedDt = case
							when @resolution like '%#dt:%' then
								subString(@resolution, charIndex('#dt:', @resolution) + 7, 2) + '/' +
								subString(@resolution, charIndex('#dt:', @resolution) + 4, 2) + '/' +
								subString(@resolution, charIndex('#dt:', @resolution) + 10, 4)
							else null end,
			[status]	= 'WORKING'
		where
			ID = @ID

		Insert into TicketHistory Values(@ID, @userID, 3, getDate(), NULL)
	End
	ELSE IF @command = 'Resolved'
	Begin
		Update
			tickets
		set
			resolution	= @resolution,
			resolvedDt	= getDate(),
			resolvedBy	= @name,
			[status]	= 'RESOLVED'
		where
			ID = @ID

		Insert into TicketHistory Values(@ID, @userID, 4, getDate(), NULL)
	End
	ELSE IF @command = 'Close'
	Begin
		Update
			tickets
		set
			resolution		= resolution + @NewLineChar + 'User Comments: ' + @resolution,
			resolvedTime	= getDate(),
			isClosed		= 1,
			[status]		= 'CLOSED'
		where
			ID = @ID

		Insert into TicketHistory Values(@ID, @userID, 5, getDate(), NULL)
	End
END
GO

/* stored procedure: getTickets (jildb) */
CREATE PROCEDURE getTickets
	@email		varchar(50),
	@userType	varchar(50)
WITH ENCRYPTION
AS
BEGIN
	SET NOCOUNT ON;

	-- color codes
	--  #ccffff blue	new, approved and assigned
	--  #ffffbb yellow	working
	--  #ffbbaa red		resolved and pending for close
	--  #bbffaa green	closed

	IF @userType = 'Developer'
	begin
		DECLARE @NewLineChar AS CHAR(2) = CHAR(13) + CHAR(10)

		-- by defualt ticket will be closed if status is 'RESOLVED' is more than 15 days
		Update
			tickets
		set
			resolution		= resolution + @NewLineChar + 'by Default Close',
			resolvedTime	= getDate(),
			isClosed		= 1,
			[status]		= 'CLOSED'
		where
			Status = 'RESOLVED' and
			DateDiff(day, resolvedDt, getDate()) >= 15

		Insert into TicketHistory(ticketID, userID, statusID, [date])
		Select ID, 24, 5, getDate() from Tickets
		Where
			ID not in (Select ticketID from TicketHistory where statusID = 5)	and
			ID in (Select ticketID from TicketHistory where statusID = 4)	and
			[status] = 'CLOSED'

		Select
			t.ID,
			convert(int, right(t.ticketID, 4)) ticketID,
			convert(varchar(5), ticketDt, 103) + ' ' + convert(varchar(5), ticketDt, 8) ticketDate,
			location,
			t.name,
			c.name coName,
			p.name prodName,
			issueType,
			issue, 25 issueLength,
			resolution,
			resolvedBy,
			isClosed,
			case
				when resolution is NULL or resolution like '#approved' or resolution like '#assigned' then '#ccffff'
				when resolution like '#Working%' then '#ffffbb'
				when resolution not like '#Working%' and isClosed = 0 then '#ffbbaa'
				when isClosed = 1 then '#bbffaa'
			end bgColor,
			0 hide,
			case
				when [status] = 'APPROVED' then 'Assign'
				when [status] = 'ASSIGNED' then 'Working'
				when [status] = 'WORKING' then 'Resolved'
				when [status] = 'RESOLVED' then ''
			end [action],
			th.comments developer
		from
			Tickets t
			left join TicketHistory th on th.ticketID = t.ID and statusID = 2
			left join Customers c on c.ID = t.custID
			left join Products p on p.ID = t.prodID
		Where
			[Status] <> 'NEW'	and
			isClosed = 0
		Order by
			ticketDt,
			t.ticketID
	end
	ELSE
	begin
		Select
			t.ID,
			convert(int, right(ticketID, 4)) ticketID,
			convert(varchar(5), ticketDt, 103) + ' ' + convert(varchar(5), ticketDt, 8) ticketDate,
			location,
			subString(t.name, 0, charIndex(' ', t.name)) + Left(subString(t.name, charIndex(' ', t.name) + 1, len(t.name)), 1) name,
			c.name coName,
			p.name prodName,
			issueType,
			isNull(p.name, '') + ' - ' + issue issue, 75 issueLength,
			resolution,
			resolvedBy,
			isClosed,
			case
				when resolution is NULL or resolution like '#approved' or resolution like '#assigned' then '#ccffff'
				when resolution like '#Working%' then '#ffffbb'
				when resolution not like '#Working%' and isClosed = 0 then '#ffbbaa'
				when isClosed = 1 then '#bbffaa'
			end bgColor,
			1 hide,
			Case
				when [status] = 'NEW' and @userType = 'SupportAdmin' then 'Approve'
				when @userType <> 'SupportAdmin' and resolution not like '#Working%' and resolvedDt is not null and isClosed = 0 then 'Close'
				else ''
			end [action],
			'T' + convert(varchar(5), resolvedDt, 103) [date]
		from
			Tickets t
			left join Customers c on c.ID = t.custID
			left join Products p on p.ID = t.prodID
		Where
			t.email like Case When @userType <> 'SupportAdmin' then @email else '%' end and
			isClosed = 0
		Order by
			ticketDt,
			ticketID
	end
END

--getTickets 'vinodtank@yahoo.com', 'Developer'
--getTickets 'support@julietapparels.com', 'SupportAdmin'
--getTickets 'manoj@julietapparels.com', 'Administrator'
