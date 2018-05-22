/*
  Payroll
  tables and stored procedures
*/

/*                      tables (tbl)                          */
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

/* table: Companies */
CREATE TABLE [dbo].[Companies](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](50) NOT NULL,
	[address] [varchar](250) NOT NULL,
	[cityID] [int] NOT NULL,
	[stateID] [int] NOT NULL,
	[pinCode] [varchar](6) NOT NULL,
	[panNo] [varchar](50) NULL,
	[tanNo] [varchar](50) NULL,
	[directorName] [varchar](50) NULL,
	[directorFName] [varchar](50) NULL,
	[directorDsgn] [varchar](50) NULL,
 CONSTRAINT [PK_CompanyProfile_Id] PRIMARY KEY CLUSTERED
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Companies]  WITH CHECK ADD  CONSTRAINT [FK_CompanyProfile_CompanyProfile] FOREIGN KEY([ID])
REFERENCES [dbo].[Companies] ([ID])
GO

ALTER TABLE [dbo].[Companies] CHECK CONSTRAINT [FK_CompanyProfile_CompanyProfile]
GO

/* table: Divisions */
CREATE TABLE [dbo].[Divisions](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[coID] [int] NOT NULL,
	[name] [varchar](50) NOT NULL,
	[prefixCode] [char](2) NOT NULL,
	[address] [varchar](250) NOT NULL,
	[cityID] [int] NOT NULL,
	[stateID] [int] NOT NULL,
	[pinCode] [varchar](6) NOT NULL,
	[pfNo] [varchar](25) NOT NULL,
	[esicNo] [varchar](25) NOT NULL,
	[ptaxNo] [varchar](25) NOT NULL,
	[licNo] [varchar](25) NULL,
	[licFreq] [varchar](15) NULL,
	[licCategory] [varchar](15) NULL,
 CONSTRAINT [PK_Dept_Master] PRIMARY KEY CLUSTERED
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

/* table: Dept */
CREATE TABLE [dbo].[Dept](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](25) NOT NULL,
	[desc] [varchar](100) NULL,
 CONSTRAINT [PK_Departments] PRIMARY KEY CLUSTERED
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

/* table: Dsgn */
CREATE TABLE [dbo].[Dsgn](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](25) NOT NULL,
	[desc] [varchar](100) NULL,
 CONSTRAINT [PK_Designations] PRIMARY KEY CLUSTERED
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

/* table: Grade */
CREATE TABLE [dbo].[Grade](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](25) NOT NULL,
	[desc] [varchar](100) NULL,
 CONSTRAINT [PK_Grade] PRIMARY KEY CLUSTERED
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

/*                      stored procedures (sp)                          */
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* stored procedure: getSelectData */
CREATE PROCEDURE [dbo].[getSelectData]
	@tableName varchar(50),
	@coloumnName varchar(20)
WITH ENCRYPTION
AS
BEGIN
	SET NOCOUNT ON;
	IF @tableName = 'Employees'
		EXEC('select ''0'' as id, ''(Select)'' as name,''Gender'' as gender union Select empID as ID, firstName +'' '' +  middleName + '' '' + lastName AS ' + @ColoumnName +', gender as Gender from Employees' );
	ELSE IF @tableName = 'EmployeesQE'
		EXEC('Select 0 as id, ''(Select)'' as name union select 0 as id, column_name name from information_schema.columns where table_name = ''employees'' and  column_name <> ''ID''');
	ELSE
		EXEC('select 0 as id, ''(Select)'' as name union Select ID, ' + @coloumnName +' from ' + @tableName);
END
GO

/* stored procedure: getSearchData */

/* stored procedure: getDivisions */
CREATE PROCEDURE [dbo].[getDivisions]
	@userID	int
WITH ENCRYPTION
AS
BEGIN
	SET NOCOUNT ON;

   Select
		d.ID, d.name
	from
		Divisions d
		inner join DivRights dr on dr.divID = d.ID
		inner join Users u on u.Id = dr.userID
	Where
		u.oneUserID = @userID	and
		AccessRights = 1
END

/* stored procedure: doCompanies */
CREATE PROCEDURE doCompanies
	@ID            int,
	@name			     varchar(50),
	@address		   varchar(250),
	@cityID			   int,
	@stateID		   int,
	@pinCode		   varchar(6),
	@panNo         varchar(50),
	@tanNo         varchar(50),
	@directorName	 varchar(50),
	@directorFName varchar(50),
	@directorDsgn	 varchar(50)
AS
BEGIN
	SET NOCOUNT ON;

	IF @ID = 0
		Insert into Companies
		  (name, address, cityID, stateID, pinCode, panNo, tanNo, directorName, directorFName, directorDsgn)
		values
		  (@name, @address, @cityID, @stateID, @pinCode, @panNo, @tanNo, @directorName, @directorFName, @directorDsgn);
	ELSE
		UPDATE
      Companies
		SET
			name           = @name,
			address        = @address,
			cityID         = @cityID,
			stateID        = @stateID,
			pinCode        = @pinCode,
			panNo          = @panNo,
			tanNo          = @tanNo,
			directorName   = @directorName,
			directorFName  = @directorFName,
			directorDsgn   = @directorDsgn
		WHERE
      ID = @ID;
END

/* stored procedure: doDivisions */
CREATE PROCEDURE [dbo].[doDivisions]
	@ID				int,
	@coID			int,
	@name			varchar(50),
	@prefixCode		char(2),
	@address		varchar(250),
	@cityID			int,
	@stateID		int,
	@pinCode		varchar(6),
	@pfNo			varchar(25),
	@esicNo			varchar(25),
	@ptaxNo			varchar(25),
	@licNo			varchar(25),
	@licFreq		varchar(15),
	@licCategory	varchar(15)
AS
BEGIN
	SET NOCOUNT ON;

	IF @ID = 0
		Insert into Divisions
		(
			coID,
			name,
			prefixCode,
			[address],
			cityID,
			stateID,
			pinCode,
			pfNo,
			esicNo,
			ptaxNo,
			licNo,
			licFreq,
			licCategory
		)
		values
		(
			@coID,
			@name,
			@prefixCode,
			@address,
			@cityID,
			@stateID,
			@pinCode,
			@pfNo,
			@esicNo,
			@ptaxNo,
			@licNo,
			@licFreq,
			@licCategory
		);
	ELSE
		update
			Divisions
		SET
			coID		= @coID,
			name		= @name,
			prefixCode	= @prefixCode,
			[address]	= @address,
			cityID		= @cityID,
			stateID		= @stateID,
			pinCode		= @pinCode,
			pfNo		= @pfNo,
			esicNo		= @esicNo,
			ptaxNo		= @ptaxNo,
			licNo		= @licNo,
			licFreq		= @licFreq,
			licCategory	= @licCategory
		WHERE
			ID = @ID;
END
GO

/* stored procedure: doMaster */
CREATE PROCEDURE [dbo].[doMaster]
	@tblName	varchar(25),
	@ID			int,
	@name		varchar(25),
	@desc       varchar(100)
AS
BEGIN
	SET NOCOUNT ON;

	IF @ID = 0
		-- tblName (Dept,Dsgn,Grade)
		EXEC ('Insert into ' + @tblName +
			'(
				name,
				[desc]
			  )
			values
			(''' +
				@name + ''',''' +
				@desc +
			''');'
		);
	ELSE
		EXEC ('update ' + @tblName +
		'SET
			name		=	'''+ @name +''',
			[desc]		=	'''+ @desc +'''
		WHERE
			ID = '''+ @ID + ''' ;'
		);
END
GO

/* stored procedure: getEmployeesQE */
CREATE PROCEDURE [dbo].[getEmployeesQE]
	@divID int,
	@field varchar(50)
WITH ENCRYPTION
AS
BEGIN
	SET NOCOUNT ON;

	Exec('SELECT ID, empID, firstName + '' '' + middleName + '' '' + lastName name, ' + @field + ' value from Employees Where Status = ''W'' and divID = ' + @divID + ' Order by EmpID')
END
GO

/* stored procedure: doEmployeesQE */
CREATE PROCEDURE [dbo].[doEmployeesQE]
	@ID int,
	@field varchar(50),
	@value varchar(100)
WITH ENCRYPTION
AS
BEGIN
	SET NOCOUNT ON;

	Exec('UPDATE Employees
			SET
				' + @field + ' = ' + '''' + @value + '''
			Where ID = ' + @ID + '')
END
GO

/* stored procedure: getPMPYEmployeesSummary */
-- =============================================
-- Author:		Vinod Tank
-- Create date: 2017-10-05
-- Description:	Returns Employees PMPY Summary
-- Alter date: 2017-11-09
-- Description: Left Employees added
-- =============================================
CREATE PROCEDURE getPMPYEmployeesSummary
	@divID	int
WITH ENCRYPTION
AS
BEGIN
	SET NOCOUNT ON;

	Select
		*
	from
		(Select
			Count(EmpID) totEmployees
		from
			Employees
		Where
			Status		= 'W'
			and	divID	= @divID
			or (divID	= @divID and doj >= '04/01/2016')
		) te
		cross join
		(Select
			Count(e.EmpID) eligible
		from
			Employees e
			inner join EmpSalaryMaster em on em.EmpID = e.EmpID and (Basic + DA + HRA + CA + MA + CCA + LE) <= 15000
		Where
			isPF	= 1
			and	divID	= @divID
			and doj		>= '04/01/2016'
		) ee
		cross join
		(Select
			Count(e.EmpID) notEligible
		from
			Employees e
			inner join EmpSalaryMaster em on em.EmpID = e.EmpID
		Where
			status	= 'W'
			and divID	= @divID
			and (doj	< '04/01/2016' or (Basic + DA + HRA + CA + MA + CCA + LE) > 15000)
			or (divID	= @divID and doj >= '04/01/2016' and isPF = 0 and status = 'L')
		) nee
		cross join
		(Select
			Count(EmpID) pmpyEnrolled
		from
			Employees
		Where
			divID	= @divID
			and doj		>= '04/01/2016'
			and PMPYStatus = 2
		) pe
		cross join
		(Select
			Count(e.EmpID) pmpyNotEnrolled
		from
			Employees e
			inner join EmpSalaryMaster em on em.EmpID = e.EmpID and (Basic + DA + HRA + CA + MA + CCA + LE) <= 15000
		Where
			divID	= @divID
			and doj		>= '04/01/2016'
			and (PMPYStatus is null or PMPYStatus = 0 or PMPYStatus = 1)
		) npe
END
GO
--getPMPYEmployeesSummary 1

/* stored procedure: getPMPYEmployees */
-- =============================================
-- Author:		Vinod Tank
-- Create date: 2017-10-05
-- Description:	Returns Employee PMPY status and
-- eligibilty
-- Alter date: 2017-11-09
-- Description: Left Employees added
-- =============================================
CREATE PROCEDURE getPMPYEmployees
	@command	int,		--1 KYC Pending, 2 PMPY Pending, 3 PMPY Enrolled, 4 Eligible, 5 Not Eligible, 6 Total Employees
	@divID		int
WITH ENCRYPTION
AS
BEGIN
	SET NOCOUNT ON;

	if @command = 1
	Begin
		Select
			e.empID,
			aadharName,
			convert(varchar(10), DOB, 103) dob,
			convert(varchar(10), DOJ, 103) doj,
			gender,
			maritalStatus,
			middleName,
			(Basic + DA + HRA + CA + MA + CCA + LE) gross,
			dg.name dsgn,
			aadharNo, panNo, uanNo, [status],
			0 pmpyStatus
		from
			Employees e
			inner join EmpSalaryMaster em on em.EmpID = e.EmpID and (Basic + DA + HRA + CA + MA + CCA + LE) <= 15000
			inner join Dsgn dg on dg.id = e.dsgnID
		where
			isPF	= 1
			and	divID	= @divID
			and doj		>= '04/01/2016'
			and (PMPYStatus is null or PMPYStatus = 0)
		order by
			e.status, e.empID
	End
	else if @command = 2
	Begin
		Select
			e.empID,
			aadharName,
			convert(varchar(10), DOB, 103) dob,
			convert(varchar(10), DOJ, 103) doj,
			gender,
			maritalStatus,
			middleName,
			(Basic + DA + HRA + CA + MA + CCA + LE) gross,
			dg.name dsgn,
			aadharNo, panNo, uanNo, [status],
			0 pmpyStatus
		from
			Employees e
			inner join EmpSalaryMaster em on em.EmpID = e.EmpID and (Basic + DA + HRA + CA + MA + CCA + LE) <= 15000
			inner join Dsgn dg on dg.id = e.dsgnID
		where
			isPF	= 1
			and	divID	= @divID
			and doj		>= '04/01/2016'
			and PMPYStatus = 1
		order by
			e.status, e.empID
	End
	else if @command = 3
	Begin
		Select
			e.empID,
			aadharName,
			convert(varchar(10), DOB, 103) dob,
			convert(varchar(10), DOJ, 103) doj,
			gender,
			maritalStatus,
			middleName,
			(Basic + DA + HRA + CA + MA + CCA + LE) gross,
			dg.name dsgn,
			aadharNo, panNo, uanNo, [status],
			0 pmpyStatus
		from
			Employees e
			inner join EmpSalaryMaster em on em.EmpID = e.EmpID and (Basic + DA + HRA + CA + MA + CCA + LE) <= 15000
			inner join Dsgn dg on dg.id = e.dsgnID
		where
			isPF	= 1
			and	divID	= @divID
			and doj		>= '04/01/2016'
			and PMPYStatus = 2
		order by
			e.status, e.empID
	End	else if @command = 4
	Begin
		Select
			e.empID,
			aadharName,
			convert(varchar(10), DOB, 103) dob,
			convert(varchar(10), DOJ, 103) doj,
			gender,
			maritalStatus,
			middleName,
			(Basic + DA + HRA + CA + MA + CCA + LE) gross,
			dg.name dsgn,
			aadharNo, panNo, uanNo, [status],
			pmpyStatus
		from
			Employees e
			inner join EmpSalaryMaster em on em.EmpID = e.EmpID and (Basic + DA + HRA + CA + MA + CCA + LE) <= 15000
			inner join Dsgn dg on dg.id = e.dsgnID
		where
			isPF	= 1
			and	divID	= @divID
			and doj		>= '04/01/2016'
		order by
			e.status, e.empID
	End
	else if @command = 5																		-- Not Eligible
	Begin
		Select
			e.empID,
			aadharName,
			convert(varchar(10), DOB, 103) dob,
			convert(varchar(10), DOJ, 103) doj,
			gender,
			maritalStatus,
			middleName,
			(Basic + DA + HRA + CA + MA + CCA + LE) gross,
			dg.name dsgn,
			aadharNo, panNo, uanNo, [status],
			pmpyStatus
		from
			Employees e
			inner join EmpSalaryMaster em on em.EmpID = e.EmpID
			inner join Dsgn dg on dg.id = e.dsgnID
		where
			status	= 'W'
			and divID	= @divID
			and (doj	< '04/01/2016' or (Basic + DA + HRA + CA + MA + CCA + LE) > 15000)
			or (divID	= @divID and doj >= '04/01/2016' and isPF = 0 and status = 'L')
		order by
			e.status, e.empID
	End
	else if @command = 6													-- Total Employees
	Begin
		Select
			e.empID,
			aadharName,
			convert(varchar(10), DOB, 103) dob,
			convert(varchar(10), DOJ, 103) doj,
			gender,
			maritalStatus,
			middleName,
			(Basic + DA + HRA + CA + MA + CCA + LE) gross,
			dg.name dsgn,
			aadharNo, panNo, uanNo, [status],
			pmpyStatus
		from
			Employees e
			inner join EmpSalaryMaster em on em.EmpID = e.EmpID
			inner join Dsgn dg on dg.id = e.dsgnID
		where
			Status		= 'W'
			and	divID	= @divID
			or (divID	= @divID and doj >= '04/01/2016')
		order by
			e.status, e.empID
	End
END
GO
--getPMPYEmployees 1, 4

/* stored procedure: updateEmpPMPYStatus */
CREATE PROCEDURE updateEmpPMPYStatus
	@empID	varchar(10),
	@status tinyint
WITH ENCRYPTION
AS
BEGIN
	SET NOCOUNT ON;

	update
		Employees
	set
		pmpyStatus = @status
	where
		empID	= @empID
END
GO
